import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import { singleton } from '@genie-nexus/container';
import type {
  Deployment,
  LlmFlowRepository,
  Provider,
  ProviderRepository,
} from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import type { DeploymentLLMApi, LlmRequestContext } from '@genie-nexus/types';
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatMessage,
} from '../chat-completions/types/openai.js';
// biome-ignore lint/style/useImportType: We need this to be the actual class, because of the DI.
import { ExecuteFlowEvent } from './flow/execute-flow-event.js';

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class ExecuteLlm {
  constructor(
    @inject(TypeSymbols.PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    @inject(TypeSymbols.LLM_FLOW_REPOSITORY)
    private readonly llmFlowRepository: LlmFlowRepository,
    private readonly executeFlowEvent: ExecuteFlowEvent,
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger
  ) {}

  private updateRequestWithContext(
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

    // Update messages array with context values
    const updatedMessages = [...request.messages];

    // Update system message if context has systemPrompt
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
        // Add system message if it doesn't exist
        const systemMessage: OpenAIChatMessage = {
          role: 'system',
          content: context.systemPrompt,
        };
        updatedMessages.unshift(systemMessage);
      }
    }

    // Update last user message if context has prompt
    if (context.prompt) {
      // Find the last user message index
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
        // Add user message if it doesn't exist
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

  public async execute(
    deployment: Deployment & DeploymentLLMApi,
    context: LlmRequestContext,
    request: OpenAIChatCompletionRequest
  ): Promise<{
    transformedRequest: OpenAIChatCompletionRequest;
    provider: Provider;
  }> {
    const flow = await this.llmFlowRepository.getOneByQuery(
      this.llmFlowRepository
        .createQuery()
        .eq('deploymentId', deployment.id)
        .eq('isDeleted', false)
    );

    // Execute the incoming request event if it exists
    let transformedRequest = request;
    let updatedContext = context;
    if (flow) {
      this.logger.info('Executing flow for LLM');
      updatedContext = await this.executeFlowEvent.executeForLlm(
        flow,
        'incomingRequest',
        context
      );
      transformedRequest = this.updateRequestWithContext(
        request,
        updatedContext
      );
    } else {
      this.logger.info('No flow found for LLM, just executing the request.');
    }

    // Get the provider - either from the context or use the default
    const provider = await this.providerRepository.getById(
      updatedContext.providerId
    );

    if (!provider || provider.tenantId !== deployment.tenantId) {
      throw new Error('Provider not found');
    }

    return {
      transformedRequest,
      provider,
    };
  }
}
