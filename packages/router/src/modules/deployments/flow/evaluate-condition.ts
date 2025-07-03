import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type {
  Condition,
  LlmRequestContext,
  WeaveRequestContext,
} from '@genie-nexus/types';
import { GetLlmFieldValue } from './get-llm-field-value.js';
import { GetWeaveFieldValue } from './get-weave-field-value.js';

@scoped(Lifecycle.ContainerScoped)
export class EvaluateCondition {
  constructor(
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    @inject(GetWeaveFieldValue)
    private readonly getWeaveFieldValue: GetWeaveFieldValue,
    @inject(GetLlmFieldValue)
    private readonly getLlmFieldValue: GetLlmFieldValue
  ) {}

  public evaluate(
    condition: Condition,
    context: WeaveRequestContext | LlmRequestContext
  ): boolean {
    if (!condition) {
      return true;
    }

    const fieldValue =
      'model' in context
        ? this.getLlmFieldValue.getFieldValue(condition.field, context)
        : this.getWeaveFieldValue.getFieldValue(condition.field, context);

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
