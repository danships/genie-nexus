import { TypeSymbols } from "@genie-nexus/container";
import type { Logger } from "@genie-nexus/logger";
import type {
  Condition,
  WeaveFlow,
  WeaveRequestContext,
} from "@genie-nexus/types";
import { getContainer } from "@lib/core/get-container";
import { evaluateCondition } from "./evaluate-condition";
import { executeWeaveAction } from "./execute-weave-action";

function evaluateConditions(
  conditions: Condition[],
  context: WeaveRequestContext
): boolean {
  for (const condition of conditions) {
    if (!evaluateCondition(condition, context)) {
      return false;
    }
  }
  return true;
}

export async function executeWeaveFlowEvent(
  flow: WeaveFlow,
  eventType: "incomingRequest" | "response",
  context: WeaveRequestContext
): Promise<WeaveRequestContext> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);

  logger.debug("Executing weave flow event", {
    flowId: flow.id,
    eventType,
  });

  const event = flow.events?.find((e) => e.type === eventType && e.enabled);
  if (!event) {
    return context;
  }

  const newContext = { ...context };

  if (event.pipeline.enabled) {
    for (const step of event.pipeline.steps) {
      if (step.conditions) {
        const shouldExecute = evaluateConditions(step.conditions, newContext);
        if (!shouldExecute) {
          continue;
        }
      }

      await executeWeaveAction(step.action, newContext);
    }
  }

  return newContext;
}
