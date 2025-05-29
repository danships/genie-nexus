import { z } from 'zod';

// Condition Types
export const equalsConditionSchema = z.object({
  type: z.literal('equals'),
  field: z.string(),
  value: z.string(),
});

export const notEqualsConditionSchema = z.object({
  type: z.literal('notEquals'),
  field: z.string(),
  value: z.string(),
});

export const containsConditionSchema = z.object({
  type: z.literal('contains'),
  field: z.string(),
  value: z.string(),
});

export const doesNotContainConditionSchema = z.object({
  type: z.literal('doesNotContain'),
  field: z.string(),
  value: z.string(),
});

export const isEmptyConditionSchema = z.object({
  type: z.literal('isEmpty'),
  field: z.string(),
});

export const isNotEmptyConditionSchema = z.object({
  type: z.literal('isNotEmpty'),
  field: z.string(),
});

export const conditionSchema = z.discriminatedUnion('type', [
  equalsConditionSchema,
  notEqualsConditionSchema,
  containsConditionSchema,
  doesNotContainConditionSchema,
  isEmptyConditionSchema,
  isNotEmptyConditionSchema,
]);

// Action Types
export const addRequestHeaderActionSchema = z.object({
  type: z.literal('addRequestHeader'),
  key: z.string(),
  value: z.string(),
});

export const removeRequestHeaderActionSchema = z.object({
  type: z.literal('removeRequestHeader'),
  key: z.string(),
});

export const setRequestHeaderActionSchema = z.object({
  type: z.literal('setRequestHeader'),
  key: z.string(),
  value: z.string(),
});

export const addResponseHeaderActionSchema = z.object({
  type: z.literal('addResponseHeader'),
  key: z.string(),
  value: z.string(),
});

export const removeResponseHeaderActionSchema = z.object({
  type: z.literal('removeResponseHeader'),
  key: z.string(),
});

export const setResponseHeaderActionSchema = z.object({
  type: z.literal('setResponseHeader'),
  key: z.string(),
  value: z.string(),
});

export const updateResponseBodyActionSchema = z.object({
  type: z.literal('updateResponseBody'),
  value: z.string(),
});

export const updateResponseStatusCodeActionSchema = z.object({
  type: z.literal('updateResponseStatusCode'),
  value: z.string(),
});

export const actionSchema = z.discriminatedUnion('type', [
  addRequestHeaderActionSchema,
  removeRequestHeaderActionSchema,
  setRequestHeaderActionSchema,
  addResponseHeaderActionSchema,
  removeResponseHeaderActionSchema,
  setResponseHeaderActionSchema,
  updateResponseBodyActionSchema,
  updateResponseStatusCodeActionSchema,
]);

export const flowStepSchema = z.object({
  condition: conditionSchema.optional(),
  action: actionSchema,
});

export const flowSchema = z.object({
  id: z.string(),
  deploymentId: z.string(),
  steps: z.array(flowStepSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
