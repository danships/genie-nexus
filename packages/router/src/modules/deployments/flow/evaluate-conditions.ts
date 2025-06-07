import { logger } from '@genie-nexus/logger';
import type { Condition, RequestContext } from '@genie-nexus/types';
import { evaluateCondition } from './evaluate-condition.js';

export function evaluateConditions(
  conditions: Condition[],
  context: RequestContext
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
