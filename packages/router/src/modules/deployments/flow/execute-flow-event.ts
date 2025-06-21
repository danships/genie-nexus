import {
  Lifecycle,
  TypeSymbols,
  inject,
  scoped,
  singleton,
} from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type {
  LlmFlow,
  LlmRequestContext,
  WeaveFlow,
  WeaveRequestContext,
} from '@genie-nexus/types';

// biome-ignore lint/style/useImportType: We need this to be the actual class, because of the DI.
import { EvaluateConditions } from './evaluate-conditions.js';
// biome-ignore lint/style/useImportType: We need this to be the actual class, because of the DI.
import { ExecuteLlmAction } from './execute-llm-action.js';
// biome-ignore lint/style/useImportType: We need this to be the actual class, because of the DI.
import { ExecuteWeaveAction } from './execute-weave-action.js';

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class ExecuteFlowEvent {
  constructor(
    private readonly evaluateConditions: EvaluateConditions,
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    private readonly executeWeaveAction: ExecuteWeaveAction,
    private readonly executeLlmAction: ExecuteLlmAction
  ) {}

  public async executeForWeave(
    flow: WeaveFlow,
    eventType: 'incomingRequest' | 'response',
    context: WeaveRequestContext
  ): Promise<WeaveRequestContext> {
    this.logger.debug('Executing weave flow event', {
      flowId: flow.id,
      eventType,
    });

    // Find the event for this type
    const event = flow.events?.find((e) => e.type === eventType && e.enabled);
    if (!event) {
      return context;
    }

    // Create a copy of the context to modify
    const newContext = { ...context };

    // Execute each step in the event's pipeline if enabled
    if (event.pipeline.enabled) {
      for (const step of event.pipeline.steps) {
        // Check condition if present
        if (step.conditions) {
          const shouldExecute = this.evaluateConditions.evaluate(
            step.conditions,
            newContext
          );
          if (!shouldExecute) {
            continue;
          }
        }

        // Execute the action
        await this.executeWeaveAction.execute(step.action, newContext);
      }
    }

    return newContext;
  }

  public async executeForLlm(
    flow: LlmFlow,
    eventType: 'incomingRequest' | 'response',
    context: LlmRequestContext
  ): Promise<LlmRequestContext> {
    this.logger.debug('Executing llm flow event', {
      flowId: flow.id,
      eventType,
    });

    // Find the event for this type
    const event = flow.events?.find((e) => e.type === eventType && e.enabled);
    if (!event) {
      return context;
    }

    // Create a copy of the context to modify
    const newContext = { ...context };

    // Execute each step in the event's pipeline if enabled
    if (event.pipeline.enabled) {
      for (const step of event.pipeline.steps) {
        // Check condition if present
        if (step.conditions) {
          const shouldExecute = this.evaluateConditions.evaluate(
            step.conditions,
            newContext
          );
          if (!shouldExecute) {
            continue;
          }
        }

        // Execute the action
        this.executeLlmAction.execute(step.action, newContext);
      }
    }

    return newContext;
  }
}
