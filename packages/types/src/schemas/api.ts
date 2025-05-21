import z from 'zod';

/**
 * These are all the database types, but without id and tenantId.
 */

// Header Definition schema
export const headerDefinitionSchema = z.object({
  key: z.string(),
  operation: z.enum(['set', 'add', 'remove']),
  value: z.string().optional(),
});

// Provider schemas
const baseProviderSchema = z.object({
  name: z.string(),
});

export const openAIProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('openai'),
  apiKey: z.string(),
  baseURL: z.string().url(),
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
  weaveHttpProxyProviderSchemaApi,
  weaveHttpStaticProviderSchemaApi,
]);

// Deployment schemas
const baseDeploymentSchemaApi = z.object({
  name: z.string(),
  active: z.boolean(),
  defaultProviderId: z.string(),
});

export const deploymentLLMSchemaApi = baseDeploymentSchemaApi.extend({
  type: z.literal('llm'),
  model: z.string(),
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

// API Key schemas
const baseApiKeySchemaApi = z.object({
  label: z.string(),
  hash: z.string(),
  active: z.boolean(),
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

// Tenant schema
export const tenantSchemaApi = z.object({
  name: z.string(),
});
