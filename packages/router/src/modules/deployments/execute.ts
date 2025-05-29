import type { Deployment, Provider } from '@genie-nexus/database';
import type { Flow, RequestContext } from '@genie-nexus/types';
import { getProviderRepository } from '../../core/db/index.js';
import { getFlowRepository } from '../../core/db/index.js';
import { logger } from '../../core/logger.js';
import { proxyRequest } from '../../weave-providers/http-proxy/proxy.js';
import { generateStaticResponse } from '../../weave-providers/static/generate-static-response.js';
import type { ProviderResponse } from '../../weave-providers/types.js';
import type { OpenAIChatCompletionRequest } from '../chat-completions/types/openai.js';
import { evaluateCondition } from './flow/evaluate-condition.js';
import { executeAction } from './flow/execute-action.js';

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
  const provider = await providerRepository.getById(
    deployment.defaultProviderId
  );

  if (!provider) {
    throw new Error('Provider not found');
  }

  // Get the flow for this deployment
  const flow = await flowRepository.getOneByQuery(
    flowRepository
      .createQuery()
      .eq('deploymentId', deployment.id)
      .eq('isDeleted', false)
  );

  // Execute the flow if it exists to transform the request
  const transformedRequest = flow ? await executeFlow(flow, request) : request;

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

  // Execute the flow again if it exists to transform the response
  const finalContext = flow
    ? await executeFlow(flow, responseContext)
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

export async function executeFlow(
  flow: Flow,
  context: RequestContext
): Promise<RequestContext> {
  logger.debug('Executing flow', { flowId: flow.id });

  // Create a copy of the context to modify
  const newContext = { ...context };

  // Execute each step in the flow
  for (const step of flow.steps) {
    // Check condition if present
    if (step.condition) {
      const shouldExecute = evaluateCondition(step.condition, newContext);
      if (!shouldExecute) {
        continue;
      }
    }

    // Execute the action
    await executeAction(step.action, newContext);
  }

  return newContext;
}
