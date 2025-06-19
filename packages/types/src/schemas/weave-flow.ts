import { z } from 'zod';
import {
  conditionSchema,
  logActionSchema,
  setProviderActionSchema,
} from './flow.js';

export const weaveAddRequestHeaderActionSchema = z.object({
  type: z.literal('addRequestHeader'),
  key: z.string(),
  value: z.string(),
});

export const weaveRemoveRequestHeaderActionSchema = z.object({
  type: z.literal('removeRequestHeader'),
  key: z.string(),
});

export const weaveSetRequestHeaderActionSchema = z.object({
  type: z.literal('setRequestHeader'),
  key: z.string(),
  value: z.string(),
});

export const weaveAddResponseHeaderActionSchema = z.object({
  type: z.literal('addResponseHeader'),
  key: z.string(),
  value: z.string(),
});

export const weaveRemoveResponseHeaderActionSchema = z.object({
  type: z.literal('removeResponseHeader'),
  key: z.string(),
});

export const weaveSetResponseHeaderActionSchema = z.object({
  type: z.literal('setResponseHeader'),
  key: z.string(),
  value: z.string(),
});

export const weaveUpdateResponseBodyActionSchema = z.object({
  type: z.literal('updateResponseBody'),
  value: z.string(),
});

export const weaveUpdateResponseStatusCodeActionSchema = z.object({
  type: z.literal('updateResponseStatusCode'),
  value: z.number().int().min(100).max(599),
});

export const weaveTransformDataActionSchema = z.object({
  type: z.literal('transformData'),
  expression: z.string(), // e.g. JS or expression
});

export const weaveFilterActionSchema = z.object({
  type: z.literal('filter'),
  expression: z.string(), // e.g. filter expression
});

export const weaveDelayActionSchema = z.object({
  type: z.literal('delay'),
  ms: z.number(), // delay in milliseconds
});

export const weaveActionSchema = z.discriminatedUnion('type', [
  weaveAddRequestHeaderActionSchema,
  weaveRemoveRequestHeaderActionSchema,
  weaveSetRequestHeaderActionSchema,
  weaveAddResponseHeaderActionSchema,
  weaveRemoveResponseHeaderActionSchema,
  weaveSetResponseHeaderActionSchema,
  weaveUpdateResponseBodyActionSchema,
  weaveUpdateResponseStatusCodeActionSchema,
  weaveTransformDataActionSchema,
  weaveFilterActionSchema,
  weaveDelayActionSchema,
  logActionSchema,
  setProviderActionSchema,
]);

export const weaveFlowStepSchema = z.object({
  id: z.string(),
  conditions: z.array(conditionSchema).optional(),
  action: weaveActionSchema,
});

export const weavePipelineSchema = z.object({
  id: z.string(),
  steps: z.array(weaveFlowStepSchema),
  enabled: z.boolean(),
});

export const llmEventSchema = z.object({
  id: z.string(),
  type: z.enum(['incomingRequest', 'response', 'requestFailed', 'timeout']),
  name: z.string(),
  pipeline: weavePipelineSchema,
  enabled: z.boolean(),
});

export const weaveFlowSchema = z.object({
  id: z.string(),
  deploymentId: z.string(),
  events: z.array(llmEventSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isDeleted: z.boolean().optional(),
});
