import type { z } from 'zod';
import type {
  providerSchema,
  deploymentSchema,
  apiKeySchema,
  tenantSchema,
  nextAuthUserSchema,
  weaveHttpStaticProviderSchema,
  deploymentLLMSchema,
  deploymentWeaveSchema,
  openAIProviderSchema,
  staticLlmProviderSchema,
  weaveHttpProxyProviderSchema,
  llmApiKeySchema,
  managementKeySchema,
  weaveApiKeySchema,
  googleProviderSchema,
} from '../schemas/db.js';

// Infer types from schemas
export type Provider = z.infer<typeof providerSchema>;
export type Deployment = z.infer<typeof deploymentSchema>;
export type ApiKey = z.infer<typeof apiKeySchema>;
export type Tenant = z.infer<typeof tenantSchema>;
export type NextAuthUser = z.infer<typeof nextAuthUserSchema>;

export type DeploymentLLM = z.infer<typeof deploymentLLMSchema>;
export type DeploymentWeave = z.infer<typeof deploymentWeaveSchema>;

export type OpenAIProvider = z.infer<typeof openAIProviderSchema>;
export type GoogleProvider = z.infer<typeof googleProviderSchema>;
export type StaticLlmProvider = z.infer<typeof staticLlmProviderSchema>;
export type WeaveHttpProxyProvider = z.infer<
  typeof weaveHttpProxyProviderSchema
>;
export type WeaveHttpStaticProvider = z.infer<
  typeof weaveHttpStaticProviderSchema
>;

export type LlmApiKey = z.infer<typeof llmApiKeySchema>;
export function isLlmApiKey(apiKey: ApiKey): apiKey is LlmApiKey {
  return 'type' in apiKey && apiKey.type === 'llm-api-key';
}

export type ManagementApiKey = z.infer<typeof managementKeySchema>;
export type WeaveApiKey = z.infer<typeof weaveApiKeySchema>;
