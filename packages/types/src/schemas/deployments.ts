import { z } from 'zod';
import { entityWithTenantIdSchema } from './shared.js';

// API Deployment schemas (without id and tenantId)
const baseDeploymentSchemaApi = z.object({
  name: z.string(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  active: z.boolean(),
  defaultProviderId: z.string(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const deploymentLLMSchemaApi = baseDeploymentSchemaApi.extend({
  type: z.literal('llm'),
  model: z.string().optional(),
});

export const deploymentWeaveSchemaApi = baseDeploymentSchemaApi.extend({
  type: z.literal('weave'),
  requiresApiKey: z.boolean(),
  supportedMethods: z
    .array(z.enum(['get', 'post', 'put', 'delete', 'patch', 'options']))
    .optional(),
});

export const deploymentSchemaApi = z.discriminatedUnion('type', [
  deploymentLLMSchemaApi,
  deploymentWeaveSchemaApi,
]);

// DB Deployment schemas (with id and tenantId)
export const deploymentLLMSchema = deploymentLLMSchemaApi.and(
  entityWithTenantIdSchema
);

export const deploymentWeaveSchema = deploymentWeaveSchemaApi.and(
  entityWithTenantIdSchema
);

export const deploymentSchema = deploymentSchemaApi.and(
  entityWithTenantIdSchema
);
