import { TypeSymbols } from '@genie-nexus/container';
import type {
  Deployment,
  LlmFlowRepository,
  Provider,
  ProviderRepository,
} from '@genie-nexus/database';
import type { DeploymentLLMApi, LlmRequestContext } from '@genie-nexus/types';
import { getContainer } from '@lib/core/get-container';
import type { OpenAIChatCompletionRequest, OpenAIChatMessage } from './types';

function updateRequestWithContext(
  request: OpenAIChatCompletionRequest,
  context: LlmRequestContext
): OpenAIChatCompletionRequest {
  const updatedRequest = {
    ...request,
    model: context.model,
  };
  if (context.user) {
    updatedRequest.user = context.user;
  }

  const updatedMessages = [...request.messages];

  if (context.systemPrompt) {
    const systemMessageIndex = updatedMessages.findIndex(
      (message) => message.role === 'system'
    );
    if (systemMessageIndex !== -1 && updatedMessages[systemMessageIndex]) {
      updatedMessages[systemMessageIndex] = {
        ...updatedMessages[systemMessageIndex],
        content: context.systemPrompt,
      };
    } else {
      const systemMessage: OpenAIChatMessage = {
        role: 'system',
        content: context.systemPrompt,
      };
      updatedMessages.unshift(systemMessage);
    }
  }

  if (context.prompt) {
    let userMessageIndex = -1;
    for (let i = updatedMessages.length - 1; i >= 0; i--) {
      if (updatedMessages[i]?.role === 'user') {
        userMessageIndex = i;
        break;
      }
    }
    if (userMessageIndex !== -1 && updatedMessages[userMessageIndex]) {
      updatedMessages[userMessageIndex] = {
        ...updatedMessages[userMessageIndex],
        role: 'user',
        content: context.prompt,
      };
    } else {
      const userMessage: OpenAIChatMessage = {
        role: 'user',
        content: context.prompt,
      };
      updatedMessages.push(userMessage);
    }
  }

  updatedRequest.messages = updatedMessages;

  return updatedRequest;
}

type DeploymentWithTenant = Deployment &
  DeploymentLLMApi & { tenantId: string };

export async function executeLlm(
  deployment: DeploymentWithTenant,
  context: LlmRequestContext,
  request: OpenAIChatCompletionRequest
): Promise<{
  transformedRequest: OpenAIChatCompletionRequest;
  provider: Provider;
}> {
  const container = await getContainer();
  const providerRepository = container.resolve<ProviderRepository>(
    TypeSymbols.PROVIDER_REPOSITORY
  );
  const llmFlowRepository = container.resolve<LlmFlowRepository>(
    TypeSymbols.LLM_FLOW_REPOSITORY
  );

  const flow = await llmFlowRepository.getOneByQuery(
    llmFlowRepository
      .createQuery()
      .eq('deploymentId', deployment.id)
      .eq('isDeleted', false)
  );

  let transformedRequest = request;
  let updatedContext = context;

  if (flow?.events) {
    const event = flow.events.find(
      (e) => e.type === 'incomingRequest' && e.enabled
    );
    if (event?.pipeline?.enabled) {
      for (const step of event.pipeline.steps) {
        const action = step.action;
        if (action.type === 'updateModel') {
          updatedContext = { ...updatedContext, model: action.modelName };
        } else if (action.type === 'updatePrompt') {
          if (action.what === 'prompt') {
            updatedContext = { ...updatedContext, prompt: action.value };
          } else if (action.what === 'systemPrompt') {
            updatedContext = { ...updatedContext, systemPrompt: action.value };
          }
        } else if (action.type === 'setProvider') {
          updatedContext = { ...updatedContext, providerId: action.providerId };
        }
      }
    }
    transformedRequest = updateRequestWithContext(request, updatedContext);
  }

  const provider = await providerRepository.getById(updatedContext.providerId);

  if (!provider || provider.tenantId !== deployment.tenantId) {
    throw new Error('Provider not found');
  }

  return {
    transformedRequest,
    provider,
  };
}
