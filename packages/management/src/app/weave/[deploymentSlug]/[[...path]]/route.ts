import { checkApiKey } from "@lib/api/middleware/check-api-key";
import { environment } from "@lib/environment";
import { handleWeaveProxy } from "@lib/weave/handlers/weave-proxy";
import { NextResponse } from "next/server";

const DEFAULT_TENANT_ID = "default";

async function handleRequest(
  request: Request,
  context: { params: Promise<{ deploymentSlug: string; path?: string[] }> }
) {
  const params = await context.params;
  const { deploymentSlug, path } = params;

  if (environment.MULTI_TENANT) {
    return NextResponse.json(
      { error: "Tenant path required in multi-tenant mode" },
      { status: 400 }
    );
  }

  let tenantId = DEFAULT_TENANT_ID;
  try {
    const { apiKey } = await checkApiKey(request, "weave-api-key");
    tenantId = apiKey.tenantId;
  } catch {
    // API key is optional for weave - deployment.requiresApiKey is checked in handler
  }

  const fullPath = path ? `/${path.join("/")}` : "/";

  return handleWeaveProxy(request, {
    tenantId,
    deploymentSlug,
    path: fullPath,
  });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;
