import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type {
  Condition,
  LlmRequestContext,
  WeaveRequestContext,
} from '@genie-nexus/types';
import { EvaluateCondition } from './evaluate-condition.js';

@scoped(Lifecycle.ContainerScoped)
export class EvaluateConditions {
  constructor(
    @inject(EvaluateCondition)
    private readonly evaluateCondition: EvaluateCondition,
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger
  ) {}

  public evaluate<T extends WeaveRequestContext | LlmRequestContext>(
    conditions: Condition[],
    context: T
  ): boolean {
    this.logger.debug('Evaluating conditions', { conditions, context });
    for (const condition of conditions) {
      if (!this.evaluateCondition.evaluate(condition, context)) {
        this.logger.debug('Condition not met', { condition, context });
        return false;
      }
    }
    return true;
  }
}
