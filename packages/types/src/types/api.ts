import type {
  deploymentLLMSchemaApi,
  deploymentWeaveSchemaApi,
  headerDefinitionSchema,
  openAIProviderSchemaApi,
  providerSchemaApi,
  staticLlmProviderSchemaApi,
  weaveHttpProxyProviderSchemaApi,
  weaveHttpStaticProviderSchemaApi,
} from '../schemas/api';
import type { z } from 'zod';

export type HeaderDefinition = z.infer<typeof headerDefinitionSchema>;

export type DeploymentLLMApi = z.infer<typeof deploymentLLMSchemaApi>;
export type DeploymentWeaveApi = z.infer<typeof deploymentWeaveSchemaApi>;

export type OpenAIProviderApi = z.infer<typeof openAIProviderSchemaApi>;
export type StaticLlmProviderApi = z.infer<typeof staticLlmProviderSchemaApi>;
export type WeaveHttpProxyProviderApi = z.infer<
  typeof weaveHttpProxyProviderSchemaApi
>;
export type WeaveHttpStaticProviderApi = z.infer<
  typeof weaveHttpStaticProviderSchemaApi
>;
export type ProviderApi = z.infer<typeof providerSchemaApi>;
