import { Lifecycle, scoped } from '@genie-nexus/container';
import type { LlmRequestContext } from '@genie-nexus/types';

@scoped(Lifecycle.ContainerScoped)
export class GetLlmFieldValue {
  public getFieldValue(field: string, context: LlmRequestContext): unknown {
    const [section, key] = field.split('.');
    switch (section) {
      case 'request':
        switch (key) {
          case 'model':
            return context.model;
          case 'prompt':
            return context.prompt;
          case 'systemPrompt':
            return context.systemPrompt;
          case 'user':
            return context.user;
          case 'providerId':
            return context.providerId;
          default:
            return undefined;
        }
      case 'response':
        switch (key) {
          case 'message':
            return context.responseMessage;
          default:
            return undefined;
        }
      default:
        return undefined;
    }
  }
}
