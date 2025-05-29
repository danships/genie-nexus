import type { Deployment, Provider } from '@genie-nexus/database';
import type { Flow, RequestContext } from '@genie-nexus/types';
import { getProviderRepository } from '../../core/db/index.js';
import { getFlowRepository } from '../../core/db/index.js';
import { logger } from '../../core/logger.js';
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

  // Execute the flow if it exists
  const transformedRequest = flow ? executeFlow(flow, request) : request;

  return { provider, transformedRequest };
}

export function executeFlow(
  flow: Flow,
  context: RequestContext
): RequestContext {
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
    executeAction(step.action, newContext);
  }

  return newContext;
}
