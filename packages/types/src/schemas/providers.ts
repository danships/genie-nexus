import { z } from 'zod';
import { entityWithTenantIdSchema } from './shared.js';

// Header Definition schema (used by providers)
export const headerDefinitionSchema = z.object({
  key: z.string(),
  operation: z.enum(['set', 'add', 'remove']),
  value: z.string().optional(),
});

const baseProviderSchema = z.object({
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().datetime().optional(),
});

// API Provider schemas (without id and tenantId)
export const openAIProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('openai'),
  apiKey: z.string(),
  baseURL: z.string().url(),
});

export const googleProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('google'),
  apiKey: z.string(),
});

export const staticLlmProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('static'),
});

export const weaveHttpProxyProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('http-proxy'),
  baseUrl: z.string().url(),
  requestHeaders: z.array(headerDefinitionSchema).optional(),
  responseHeaders: z.array(headerDefinitionSchema).optional(),
});

export const weaveHttpStaticProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('http-static'),
  responseHeaders: z.array(headerDefinitionSchema).optional(),
  body: z.string().optional(),
  statusCode: z.number().int().positive().optional(),
});

export const providerSchemaApi = z.discriminatedUnion('type', [
  openAIProviderSchemaApi,
  staticLlmProviderSchemaApi,
  googleProviderSchemaApi,
  weaveHttpProxyProviderSchemaApi,
  weaveHttpStaticProviderSchemaApi,
]);

// DB Provider schemas (with id and tenantId)
export const openAIProviderSchema = openAIProviderSchemaApi.and(
  entityWithTenantIdSchema
);

export const googleProviderSchema = googleProviderSchemaApi.and(
  entityWithTenantIdSchema
);

export const staticLlmProviderSchema = staticLlmProviderSchemaApi.and(
  entityWithTenantIdSchema
);

export const weaveHttpProxyProviderSchema = weaveHttpProxyProviderSchemaApi.and(
  entityWithTenantIdSchema
);

export const weaveHttpStaticProviderSchema =
  weaveHttpStaticProviderSchemaApi.and(entityWithTenantIdSchema);

export const providerSchema = providerSchemaApi.and(entityWithTenantIdSchema);
