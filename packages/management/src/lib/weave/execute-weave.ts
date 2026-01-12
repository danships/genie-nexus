import { TypeSymbols } from "@genie-nexus/container";
import type {
  Deployment,
  Provider,
  ProviderRepository,
  WeaveFlowRepository,
} from "@genie-nexus/database";
import type { DeploymentWeaveApi, WeaveRequestContext } from "@genie-nexus/types";
import { getContainer } from "@lib/core/get-container";
import { executeWeaveFlowEvent } from "./flow/execute-flow-event";
import { proxyRequest } from "./providers/http-proxy";
import { generateStaticResponse } from "./providers/static";
import type { ProviderResponse } from "./types";

type DeploymentWithTenant = Deployment & DeploymentWeaveApi & { tenantId: string };

export async function executeWeave(
  deployment: DeploymentWithTenant,
  request: WeaveRequestContext
): Promise<{
  provider: Provider;
  transformedRequest: WeaveRequestContext;
  providerResponse: ProviderResponse;
}> {
  const container = await getContainer();
  const providerRepository = container.resolve<ProviderRepository>(
    TypeSymbols.PROVIDER_REPOSITORY
  );
  const flowRepository = container.resolve<WeaveFlowRepository>(
    TypeSymbols.WEAVE_FLOW_REPOSITORY
  );

  const flow = await flowRepository.getOneByQuery(
    flowRepository
      .createQuery()
      .eq("deploymentId", deployment.id)
      .eq("isDeleted", false)
  );

  const transformedRequest = flow
    ? await executeWeaveFlowEvent(flow, "incomingRequest", request)
    : request;

  const provider = await providerRepository.getById(
    transformedRequest.providerId
  );

  if (!provider || provider.tenantId !== deployment.tenantId) {
    throw new Error("Provider not found");
  }

  let providerResponse: ProviderResponse;
  switch (provider.type) {
    case "http-proxy": {
      providerResponse = await proxyRequest(
        provider,
        transformedRequest,
        transformedRequest.path
      );
      break;
    }
    case "http-static": {
      providerResponse = generateStaticResponse(provider);
      break;
    }
    default: {
      throw new Error(`Unknown provider type ${provider.type}`);
    }
  }

  const responseContext: WeaveRequestContext = {
    ...transformedRequest,
    responseHeaders: providerResponse.headers,
    responseBody: providerResponse.body,
    responseStatusCode: providerResponse.statusCode,
  };

  const finalContext = flow
    ? await executeWeaveFlowEvent(flow, "response", responseContext)
    : responseContext;

  return {
    provider,
    transformedRequest,
    providerResponse: {
      statusCode: finalContext.responseStatusCode,
      headers: finalContext.responseHeaders,
      body: finalContext.responseBody as Buffer,
    },
  };
}
