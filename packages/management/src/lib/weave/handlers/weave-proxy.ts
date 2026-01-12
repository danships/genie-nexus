import { TypeSymbols } from "@genie-nexus/container";
import type { Logger } from "@genie-nexus/logger";
import type { WeaveRequestContext } from "@genie-nexus/types";
import { checkApiKey } from "@lib/api/middleware/check-api-key";
import { handleApiError } from "@lib/api/middleware/handle-api-error";
import { getContainer } from "@lib/core/get-container";
import { NextResponse } from "next/server";
import { executeWeave } from "../execute-weave";
import { getWeaveDeploymentBySlug } from "../get-deployment-by-slug";

interface WeaveProxyParams {
  tenantId: string;
  deploymentSlug: string;
  path: string;
}

export async function handleWeaveProxy(
  request: Request,
  params: WeaveProxyParams
): Promise<NextResponse> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);

  try {
    const { tenantId, deploymentSlug, path } = params;

    logger.debug("Starting weave request processing", {
      deploymentSlug,
      path,
    });

    const deployment = await getWeaveDeploymentBySlug(tenantId, deploymentSlug);
    if (!deployment) {
      return NextResponse.json(
        { error: "Deployment not found" },
        { status: 404 }
      );
    }

    if (deployment.requiresApiKey) {
      try {
        await checkApiKey(request, "weave-api-key");
      } catch {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
    }

    const lowercaseMethod = request.method.toLowerCase() as
      | "get"
      | "post"
      | "put"
      | "delete"
      | "patch"
      | "options";
    if (
      deployment.supportedMethods &&
      !deployment.supportedMethods.includes(lowercaseMethod)
    ) {
      return NextResponse.json(
        { error: "Request method not supported" },
        { status: 405 }
      );
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const requestHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      requestHeaders[key] = value;
    });

    let requestBody: unknown;
    const contentType = request.headers.get("content-type");
    if (
      request.method.toUpperCase() !== "GET" &&
      request.method.toUpperCase() !== "HEAD"
    ) {
      if (contentType?.includes("application/json")) {
        try {
          requestBody = await request.json();
        } catch {
          requestBody = await request.text();
        }
      } else {
        requestBody = await request.text();
      }
    }

    const requestContext: WeaveRequestContext = {
      path: normalizedPath,
      method: request.method,
      requestHeaders,
      requestBody,
      responseHeaders: {},
      responseBody: undefined,
      responseStatusCode: 200,
      providerId: deployment.defaultProviderId,
    };

    logger.appendFixedMetadata({ deployment: deployment.id });

    const { providerResponse } = await executeWeave(deployment, requestContext);

    const responseHeaders = new Headers();
    Object.entries(providerResponse.headers).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(new Uint8Array(providerResponse.body), {
      status: providerResponse.statusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
