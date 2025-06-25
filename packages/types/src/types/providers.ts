import type { z } from 'zod';
import type {
  googleProviderSchema,
  googleProviderSchemaApi,
  headerDefinitionSchema,
  openAIProviderSchema,
  openAIProviderSchemaApi,
  providerSchema,
  providerSchemaApi,
  staticLlmProviderSchema,
  staticLlmProviderSchemaApi,
  weaveHttpProxyProviderSchema,
  weaveHttpProxyProviderSchemaApi,
  weaveHttpStaticProviderSchema,
  weaveHttpStaticProviderSchemaApi,
} from '../schemas/providers.js';
import type { WithId } from './api.js';

// API Types (without id and tenantId)
export type HeaderDefinition = z.infer<typeof headerDefinitionSchema>;
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

// DB Types (with id and tenantId)
export type OpenAIProvider = z.infer<typeof openAIProviderSchema>;
export type GoogleProvider = z.infer<typeof googleProviderSchema>;
export type StaticLlmProvider = z.infer<typeof staticLlmProviderSchema>;
export type WeaveHttpProxyProvider = z.infer<
  typeof weaveHttpProxyProviderSchema
>;
export type WeaveHttpStaticProvider = z.infer<
  typeof weaveHttpStaticProviderSchema
>;
export type Provider = z.infer<typeof providerSchema>;
