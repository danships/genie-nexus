import {
  Lifecycle,
  TypeSymbols,
  inject,
  scoped,
  singleton,
} from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { WeaveFlow, WeaveRequestContext } from '@genie-nexus/types';
import { EvaluateConditions } from './evaluate-conditions.js';
import { ExecuteAction } from './execute-action.js';

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class ExecuteFlowEvent {
  constructor(
    private readonly evaluateConditions: EvaluateConditions,
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    private readonly executeAction: ExecuteAction
  ) {}

  public async execute(
    flow: WeaveFlow,
    eventType: 'incomingRequest' | 'response',
    context: WeaveRequestContext
  ): Promise<WeaveRequestContext> {
    this.logger.debug('Executing flow event', { flowId: flow.id, eventType });

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
        await this.executeAction.execute(step.action, newContext);
      }
    }

    return newContext;
  }
}

// Function export for testing purposes
export async function executeFlowEvent(
  flow: WeaveFlow,
  eventType: 'incomingRequest' | 'response',
  context: WeaveRequestContext
): Promise<WeaveRequestContext> {
  // Create mock logger for testing
  const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warning: () => {},
    error: () => {},
    setLogLevel: () => {},
    setFixedMetadata: () => {},
    child: () => mockLogger,
    appendFixedMetadata: () => {},
  };

  // Create instances without dependency injection for testing
  const executeAction = new ExecuteAction(mockLogger);
  const evaluateCondition = new (
    await import('./evaluate-condition.js')
  ).EvaluateCondition(mockLogger);
  const evaluateConditions = new EvaluateConditions(
    evaluateCondition,
    mockLogger
  );
  const executeFlowEvent = new ExecuteFlowEvent(
    evaluateConditions,
    mockLogger,
    executeAction
  );

  return executeFlowEvent.execute(flow, eventType, context);
}
