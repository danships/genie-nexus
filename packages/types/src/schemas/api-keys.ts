import { z } from 'zod';
import { entityWithTenantIdSchema } from './shared.js';

// API API Key schemas (without id and tenantId)
const baseApiKeySchemaApi = z.object({
  label: z.string(),
  hash: z.string(),
  active: z.boolean(),
  keyPreview: z.string(),
  createdAt: z.string().datetime(),
});

export const llmApiKeySchemaApi = baseApiKeySchemaApi.extend({
  type: z.literal('llm-api-key'),
  allowedDeployments: z.array(z.string()).optional(),
});

export const managementKeySchemaApi = baseApiKeySchemaApi.extend({
  type: z.literal('management-key'),
  scopes: z.array(z.string()),
});

export const weaveApiKeySchemaApi = baseApiKeySchemaApi.extend({
  type: z.literal('weave-api-key'),
  allowedDeployments: z.array(z.string()).optional(),
});

export const apiKeySchemaApi = z.discriminatedUnion('type', [
  llmApiKeySchemaApi,
  managementKeySchemaApi,
  weaveApiKeySchemaApi,
]);

// DB API Key schemas (with id and tenantId)
export const llmApiKeySchema = llmApiKeySchemaApi.and(entityWithTenantIdSchema);

export const managementKeySchema = managementKeySchemaApi.and(
  entityWithTenantIdSchema
);

export const weaveApiKeySchema = weaveApiKeySchemaApi.and(
  entityWithTenantIdSchema
);

export const apiKeySchema = apiKeySchemaApi.and(entityWithTenantIdSchema);
