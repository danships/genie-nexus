import { z } from 'zod';

const baseEntitySchema = z.object({
  id: z.string(),
});

const entityWithTenantIdSchema = baseEntitySchema.extend({
  tenantId: z.string(),
});

// Header Definition schema
export const headerDefinitionSchema = z.object({
  key: z.string(),
  operation: z.enum(['set', 'add', 'remove']),
  value: z.string().optional(),
});

// Provider schemas
const baseProviderSchema = entityWithTenantIdSchema.extend({
  name: z.string(),
});

export const openAIProviderSchema = baseProviderSchema.extend({
  type: z.literal('openai'),
  apiKey: z.string(),
  baseURL: z.string().url(),
});

export const staticLlmProviderSchema = baseProviderSchema.extend({
  type: z.literal('static'),
});

export const weaveHttpProxyProviderSchema = baseProviderSchema.extend({
  type: z.literal('http-proxy'),
  baseUrl: z.string().url(),
  requestHeaders: z.array(headerDefinitionSchema).optional(),
  responseHeaders: z.array(headerDefinitionSchema).optional(),
});

export const weaveHttpStaticProviderSchema = baseProviderSchema.extend({
  type: z.literal('http-static'),
  responseHeaders: z.array(headerDefinitionSchema).optional(),
  body: z.string().optional(),
  statusCode: z.number().int().positive().optional(),
});

export const providerSchema = z.discriminatedUnion('type', [
  openAIProviderSchema,
  staticLlmProviderSchema,
  weaveHttpProxyProviderSchema,
  weaveHttpStaticProviderSchema,
]);

// Deployment schemas
const baseDeploymentSchema = entityWithTenantIdSchema.extend({
  name: z.string(),
  active: z.boolean(),
  defaultProviderId: z.string(),
});

export const deploymentLLMSchema = baseDeploymentSchema.extend({
  type: z.literal('llm'),
  model: z.string(),
});

export const deploymentWeaveSchema = baseDeploymentSchema.extend({
  type: z.literal('weave'),
  requiresApiKey: z.boolean(),
  supportedMethods: z
    .array(z.enum(['get', 'post', 'put', 'delete', 'patch', 'options']))
    .optional(),
  allowedDeployments: z.array(z.string()).optional(),
});

export const deploymentSchema = z.discriminatedUnion('type', [
  deploymentLLMSchema,
  deploymentWeaveSchema,
]);

// API Key schemas
const baseApiKeySchema = entityWithTenantIdSchema.extend({
  label: z.string(),
  hash: z.string(),
  active: z.boolean(),
});

export const llmApiKeySchema = baseApiKeySchema.extend({
  type: z.literal('llm-api-key'),
  allowedDeployments: z.array(z.string()).optional(),
});

export const managementKeySchema = baseApiKeySchema.extend({
  type: z.literal('management-key'),
  scopes: z.array(z.string()),
});

export const weaveApiKeySchema = baseApiKeySchema.extend({
  type: z.literal('weave-api-key'),
  allowedDeployments: z.array(z.string()).optional(),
});

export const apiKeySchema = z.discriminatedUnion('type', [
  llmApiKeySchema,
  managementKeySchema,
  weaveApiKeySchema,
]);

// Tenant schema
export const tenantSchema = baseEntitySchema.extend({
  name: z.string(),
});

// NextAuth User schema
export const nextAuthUserSchema = entityWithTenantIdSchema.extend({
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional().nullable(),
  created: z.string().datetime(),
  lastLogin: z.string().datetime().nullable(),
});
