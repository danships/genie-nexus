import type { z } from 'zod';
import type {
  actionSchema,
  addRequestHeaderActionSchema,
  addResponseHeaderActionSchema,
  conditionSchema,
  containsConditionSchema,
  delayActionSchema,
  doesNotContainConditionSchema,
  equalsConditionSchema,
  eventSchema,
  filterActionSchema,
  weaveFlowSchema,
  weaveFlowStepSchema,
  isEmptyConditionSchema,
  isNotEmptyConditionSchema,
  logActionSchema,
  notEqualsConditionSchema,
  weavePipelineSchema,
  removeRequestHeaderActionSchema,
  removeResponseHeaderActionSchema,
  setProviderActionSchema,
  setRequestHeaderActionSchema,
  setResponseHeaderActionSchema,
  transformDataActionSchema,
  updateResponseBodyActionSchema,
  updateResponseStatusCodeActionSchema,
} from '../schemas/flow.js';

export type EqualsCondition = z.infer<typeof equalsConditionSchema>;
export type NotEqualsCondition = z.infer<typeof notEqualsConditionSchema>;
export type ContainsCondition = z.infer<typeof containsConditionSchema>;
export type DoesNotContainCondition = z.infer<
  typeof doesNotContainConditionSchema
>;
export type IsEmptyCondition = z.infer<typeof isEmptyConditionSchema>;
export type IsNotEmptyCondition = z.infer<typeof isNotEmptyConditionSchema>;
export type Condition = z.infer<typeof conditionSchema>;

export type AddRequestHeaderAction = z.infer<
  typeof addRequestHeaderActionSchema
>;
export type RemoveRequestHeaderAction = z.infer<
  typeof removeRequestHeaderActionSchema
>;
export type SetRequestHeaderAction = z.infer<
  typeof setRequestHeaderActionSchema
>;
export type AddResponseHeaderAction = z.infer<
  typeof addResponseHeaderActionSchema
>;
export type RemoveResponseHeaderAction = z.infer<
  typeof removeResponseHeaderActionSchema
>;
export type SetResponseHeaderAction = z.infer<
  typeof setResponseHeaderActionSchema
>;
export type UpdateResponseBodyAction = z.infer<
  typeof updateResponseBodyActionSchema
>;
export type UpdateResponseStatusCodeAction = z.infer<
  typeof updateResponseStatusCodeActionSchema
>;
export type TransformDataAction = z.infer<typeof transformDataActionSchema>;
export type FilterAction = z.infer<typeof filterActionSchema>;
export type DelayAction = z.infer<typeof delayActionSchema>;
export type LogAction = z.infer<typeof logActionSchema>;
export type SetProviderAction = z.infer<typeof setProviderActionSchema>;
export type Action = z.infer<typeof actionSchema>;

export type WeaveFlowStep = z.infer<typeof weaveFlowStepSchema>;
export type WeaveFlow = z.infer<typeof weaveFlowSchema>;

export type WeaveRequestContext = {
  path: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  responseHeaders: Record<string, string>;
  responseBody: unknown;
  responseStatusCode: number;
  providerId: string;
};

export type WeavePipeline = z.infer<typeof weavePipelineSchema>;
export type WeaveEvent = z.infer<typeof eventSchema>;

export type WeaveFlowCreate = Omit<WeaveFlow, 'id'>;
