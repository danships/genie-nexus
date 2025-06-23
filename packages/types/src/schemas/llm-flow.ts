import { z } from 'zod';
import {
  conditionSchema,
  logActionSchema,
  setProviderActionSchema,
} from './flow.js';

export const llmUpdateModelActionSchema = z.object({
  type: z.literal('updateModel'),
  modelName: z.string(),
});

export const llmUpdatePromptActionSchema = z.object({
  type: z.literal('updatePrompt'),
  what: z.enum(['prompt', 'systemPrompt']),
  value: z.string(),
});

export const llmActionSchema = z.discriminatedUnion('type', [
  llmUpdatePromptActionSchema,
  llmUpdateModelActionSchema,
  logActionSchema,
  setProviderActionSchema,
]);

export const llmFlowStepSchema = z.object({
  id: z.string(),
  conditions: z.array(conditionSchema).optional(),
  action: llmActionSchema,
});

export const llmPipelineSchema = z.object({
  id: z.string(),
  steps: z.array(llmFlowStepSchema),
  enabled: z.boolean(),
});

export const llmEventSchema = z.object({
  id: z.string(),
  type: z.enum(['incomingRequest', 'response', 'requestFailed', 'timeout']),
  name: z.string(),
  pipeline: llmPipelineSchema,
  enabled: z.boolean(),
});

export const llmFlowSchema = z.object({
  id: z.string(),
  deploymentId: z.string(),
  events: z.array(llmEventSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isDeleted: z.boolean().optional(),
});
