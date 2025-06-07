import { logger } from '@genie-nexus/logger';
import type { Condition, RequestContext } from '@genie-nexus/types';
import { getFieldValue } from './get-field-value.js';

export function evaluateCondition(
  condition: Condition,
  context: RequestContext
): boolean {
  if (!condition) return true;

  const fieldValue = getFieldValue(condition.field, context);
  logger.debug('Evaluating condition', { condition, fieldValue });
  switch (condition.type) {
    case 'equals':
      return fieldValue == condition.value;
    case 'notEquals':
      return fieldValue != condition.value;
    case 'contains':
      return (
        typeof fieldValue === 'string' && fieldValue.includes(condition.value)
      );
    case 'doesNotContain':
      return (
        typeof fieldValue === 'string' && !fieldValue.includes(condition.value)
      );
    case 'isEmpty':
      return !fieldValue || fieldValue === '';
    case 'isNotEmpty':
      return !!fieldValue && fieldValue !== '';
    default:
      return false;
  }
}
