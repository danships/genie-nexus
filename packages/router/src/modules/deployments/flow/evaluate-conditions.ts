import { Condition, RequestContext } from '@genie-nexus/types';
import { evaluateCondition } from './evaluate-condition.js';

export function evaluateConditions(
  conditions: Condition[],
  context: RequestContext
): boolean {
  for (const condition of conditions) {
    if (!evaluateCondition(condition, context)) {
      return false;
    }
  }
  return true;
}
