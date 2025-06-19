import type { z } from 'zod';

import type {
  conditionSchema,
  containsConditionSchema,
  doesNotContainConditionSchema,
  equalsConditionSchema,
  isEmptyConditionSchema,
  isNotEmptyConditionSchema,
  notEqualsConditionSchema,
  logActionSchema,
  setProviderActionSchema,
} from '../schemas/flow.js';
import type { WeaveAction, WeaveFlow } from './weave-flow.js';
import type { LlmAction, LlmFlow } from './llm-flow.js';

export type EqualsCondition = z.infer<typeof equalsConditionSchema>;
export type NotEqualsCondition = z.infer<typeof notEqualsConditionSchema>;
export type ContainsCondition = z.infer<typeof containsConditionSchema>;
export type DoesNotContainCondition = z.infer<
  typeof doesNotContainConditionSchema
>;
export type IsEmptyCondition = z.infer<typeof isEmptyConditionSchema>;
export type IsNotEmptyCondition = z.infer<typeof isNotEmptyConditionSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export type LogAction = z.infer<typeof logActionSchema>;
export type SetProviderAction = z.infer<typeof setProviderActionSchema>;

export type Flow = WeaveFlow | LlmFlow;
export type FlowAction = WeaveAction | LlmAction;
