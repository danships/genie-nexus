import type { z } from 'zod';
import type {
  apiKeySchemaApi,
  deploymentLLMSchemaApi,
  deploymentSchemaApi,
  deploymentWeaveSchemaApi,
  googleProviderSchemaApi,
  headerDefinitionSchema,
  llmApiKeySchemaApi,
  openAIProviderSchemaApi,
  providerSchemaApi,
  staticLlmProviderSchemaApi,
  tenantSchemaApi,
  weaveApiKeySchemaApi,
  weaveHttpProxyProviderSchemaApi,
  weaveHttpStaticProviderSchemaApi,
} from '../schemas/api.js';

type WithId<T> = T & { id: string };
type DataWrapper<T> = { data: T };

export type HeaderDefinition = z.infer<typeof headerDefinitionSchema>;

export type DeploymentLLMApi = WithId<z.infer<typeof deploymentLLMSchemaApi>>;
export type DeploymentLLMApiCreate = z.infer<typeof deploymentLLMSchemaApi>;
export type DeploymentWeaveApi = WithId<
  z.infer<typeof deploymentWeaveSchemaApi>
>;
export type DeploymentWeaveApiCreate = z.infer<typeof deploymentWeaveSchemaApi>;

export type DeploymentApi = WithId<z.infer<typeof deploymentSchemaApi>>;

export type OpenAIProviderApi = z.infer<typeof openAIProviderSchemaApi>;
export type GoogleProviderApi = z.infer<typeof googleProviderSchemaApi>;
export type StaticLlmProviderApi = z.infer<typeof staticLlmProviderSchemaApi>;
export type WeaveHttpProxyProviderApi = z.infer<
  typeof weaveHttpProxyProviderSchemaApi
>;
export type WeaveHttpStaticProviderApi = z.infer<
  typeof weaveHttpStaticProviderSchemaApi
>;
export type ProviderApi = WithId<z.infer<typeof providerSchemaApi>>;
export type ApiKeyApi = WithId<z.infer<typeof apiKeySchemaApi>>;

export type LlmApiKeyApi = WithId<z.infer<typeof llmApiKeySchemaApi>>;
export type WeaveApiKeyApi = WithId<z.infer<typeof weaveApiKeySchemaApi>>;

export type TenantApi = WithId<z.infer<typeof tenantSchemaApi>>;

export type ConfigurationResponse = DataWrapper<{
  tenant: TenantApi;
  defaultTenant: boolean;
  authentication: 'none' | 'credentials';
}>;
