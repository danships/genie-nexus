import { z } from 'zod';
import * as apiSchemas from './api';

const baseEntitySchema = z.object({
  id: z.string(),
});

const entityWithTenantIdSchema = baseEntitySchema.extend({
  tenantId: z.string(),
});

export const openAIProviderSchema = apiSchemas.openAIProviderSchemaApi.and(
  entityWithTenantIdSchema,
);

export const staticLlmProviderSchema =
  apiSchemas.staticLlmProviderSchemaApi.and(entityWithTenantIdSchema);

export const weaveHttpProxyProviderSchema =
  apiSchemas.weaveHttpProxyProviderSchemaApi.and(entityWithTenantIdSchema);

export const weaveHttpStaticProviderSchema =
  apiSchemas.weaveHttpStaticProviderSchemaApi.and(entityWithTenantIdSchema);

export const providerSchema = apiSchemas.providerSchemaApi.and(
  entityWithTenantIdSchema,
);

// Deployment schemas

export const deploymentLLMSchema = apiSchemas.deploymentLLMSchemaApi.and(
  entityWithTenantIdSchema,
);

export const deploymentWeaveSchema = apiSchemas.deploymentWeaveSchemaApi.and(
  entityWithTenantIdSchema,
);

export const deploymentSchema = apiSchemas.deploymentSchemaApi.and(
  entityWithTenantIdSchema,
);

// API Key schemas

export const llmApiKeySchema = apiSchemas.llmApiKeySchemaApi.and(
  entityWithTenantIdSchema,
);

export const managementKeySchema = apiSchemas.managementKeySchemaApi.and(
  entityWithTenantIdSchema,
);

export const weaveApiKeySchema = apiSchemas.weaveApiKeySchemaApi.and(
  entityWithTenantIdSchema,
);

export const apiKeySchema = apiSchemas.apiKeySchemaApi.and(
  entityWithTenantIdSchema,
);

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
