import type { WeaveFlow, WeaveRequestContext } from '@genie-nexus/types';
import { getLogger } from '../../../core/get-logger.js';
import { evaluateConditions } from './evaluate-conditions.js';
import { executeAction } from './execute-action.js';

export async function executeFlowEvent(
  flow: WeaveFlow,
  eventType: 'incomingRequest' | 'response',
  context: WeaveRequestContext
): Promise<WeaveRequestContext> {
  const logger = getLogger();
  logger.debug('Executing flow event', { flowId: flow.id, eventType });

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
        const shouldExecute = evaluateConditions(step.conditions, newContext);
        if (!shouldExecute) {
          continue;
        }
      }

      // Execute the action
      await executeAction(step.action, newContext);
    }
  }

  return newContext;
}
