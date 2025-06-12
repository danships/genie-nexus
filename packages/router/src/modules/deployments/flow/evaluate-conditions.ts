import { logger } from '@genie-nexus/logger';
import type { Condition, WeaveRequestContext } from '@genie-nexus/types';
import { evaluateCondition } from './evaluate-condition.js';

export function evaluateConditions(
  conditions: Condition[],
  context: WeaveRequestContext
): boolean {
  logger.debug('Evaluating conditions', { conditions, context });
  for (const condition of conditions) {
    if (!evaluateCondition(condition, context)) {
      logger.debug('Condition not met', { condition, context });
      return false;
    }
  }
  return true;
}
