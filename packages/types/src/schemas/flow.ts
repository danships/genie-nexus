import { z } from 'zod';

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

// Set Provider action
export const setProviderActionSchema = z.object({
  type: z.literal('setProvider'),
  providerId: z.string(),
});

export const logActionSchema = z.object({
  type: z.literal('log'),
  message: z.string().optional(),
});
