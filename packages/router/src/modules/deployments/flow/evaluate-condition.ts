import {
  Lifecycle,
  TypeSymbols,
  inject,
  scoped,
  singleton,
} from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { Condition, WeaveRequestContext } from '@genie-nexus/types';
import { getFieldValue } from './get-field-value.js';

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class EvaluateCondition {
  constructor(@inject(TypeSymbols.LOGGER) private readonly logger: Logger) {}

  public evaluate(condition: Condition, context: WeaveRequestContext): boolean {
    if (!condition) {
      return true;
    }

    const fieldValue = getFieldValue(condition.field, context);
    this.logger.debug('Evaluating condition', { condition, fieldValue });
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
          typeof fieldValue === 'string' &&
          !fieldValue.includes(condition.value)
        );
      case 'isEmpty':
        return !fieldValue || fieldValue === '';
      case 'isNotEmpty':
        return !!fieldValue && fieldValue !== '';
      default:
        return false;
    }
  }
}
