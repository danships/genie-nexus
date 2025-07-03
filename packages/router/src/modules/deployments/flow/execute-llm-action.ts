import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { LlmAction, LlmRequestContext } from '@genie-nexus/types';

@scoped(Lifecycle.ContainerScoped)
export class ExecuteLlmAction {
  constructor(@inject(TypeSymbols.LOGGER) private readonly logger: Logger) {}

  public execute(action: LlmAction, context: LlmRequestContext): void {
    this.logger.debug('Executing action', {
      actionType: action.type,
      context: {
        model: context.model,
      },
    });

    switch (action.type) {
      case 'updateModel':
        context.model = action.modelName;
        break;
      case 'updatePrompt':
        if (action.what === 'prompt') {
          context.prompt = action.value;
        } else {
          context.systemPrompt = action.value;
        }
        break;
      case 'log':
        this.logger.info(action.message || 'Log action executed', {
          context: {
            model: context.model,
            providerId: context.providerId,
            user: context.user,
            systemPrompt: context.systemPrompt,
            prompt: context.prompt,
          },
        });
        break;
      case 'setProvider':
        context.providerId = action.providerId;
        break;
    }
  }
}
