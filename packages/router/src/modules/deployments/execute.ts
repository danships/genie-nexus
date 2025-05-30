import type { Deployment, Provider } from '@genie-nexus/database';
import type { RequestContext } from '@genie-nexus/types';
import { getProviderRepository } from '../../core/db/index.js';
import { getFlowRepository } from '../../core/db/index.js';
import { proxyRequest } from '../../weave-providers/http-proxy/proxy.js';
import { generateStaticResponse } from '../../weave-providers/static/generate-static-response.js';
import type { ProviderResponse } from '../../weave-providers/types.js';
import type { OpenAIChatCompletionRequest } from '../chat-completions/types/openai.js';
import { executeFlowEvent } from './flow/execute-flow-event.js';

export async function executeForLlm(
  deployment: Deployment,
  request: OpenAIChatCompletionRequest
): Promise<{
  transformedRequest: OpenAIChatCompletionRequest;
  provider: Provider;
}> {
  const providerRepository = await getProviderRepository();
  const provider = await providerRepository.getById(
    deployment.defaultProviderId
  );

  if (!provider) {
    throw new Error('Provider not found');
  }

  if (deployment.type !== 'llm') {
    throw new Error('Deployment is not a llm deployment');
  }

  return {
    transformedRequest: { ...request, model: deployment.model },
    provider,
  };
}

export async function executeForHttp(
  deployment: Deployment,
  request: RequestContext
): Promise<{
  provider: Provider;
  transformedRequest: RequestContext;
  providerResponse: ProviderResponse;
}> {
  const providerRepository = await getProviderRepository();
  const flowRepository = await getFlowRepository();

  // Get the flow for this deployment
  const flow = await flowRepository.getOneByQuery(
    flowRepository
      .createQuery()
      .eq('deploymentId', deployment.id)
      .eq('isDeleted', false)
  );

  // Execute the incoming request event if it exists
  const transformedRequest = flow
    ? await executeFlowEvent(flow, 'incomingRequest', request)
    : request;

  // Get the provider - either from the context or use the default
  const provider = await providerRepository.getById(
    transformedRequest.providerId
  );

  if (!provider || provider.tenantId !== deployment.tenantId) {
    throw new Error('Provider not found');
  }

  // Execute the provider to get the response
  let providerResponse: ProviderResponse;
  switch (provider.type) {
    case 'http-proxy': {
      providerResponse = await proxyRequest(
        provider,
        transformedRequest,
        transformedRequest.path
      );
      break;
    }
    case 'http-static': {
      providerResponse = generateStaticResponse(provider);
      break;
    }
    default: {
      throw new Error(`Unknown provider type ${provider.type}`);
    }
  }

  // Create a response context from the provider response
  const responseContext: RequestContext = {
    ...transformedRequest,
    responseHeaders: providerResponse.headers,
    responseBody: providerResponse.body,
    responseStatusCode: providerResponse.statusCode,
  };

  // Execute the response event if it exists
  const finalContext = flow
    ? await executeFlowEvent(flow, 'response', responseContext)
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
