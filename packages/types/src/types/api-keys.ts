import type { z } from 'zod';
import type {
  llmApiKeySchema,
  managementKeySchema,
  weaveApiKeySchema,
  apiKeySchema,
  llmApiKeySchemaApi,
  weaveApiKeySchemaApi,
  apiKeySchemaApi,
} from '../schemas/api-keys.js';
import type { WithId } from './api.js';

// API Types (without id and tenantId)
export type LlmApiKeyApi = WithId<z.infer<typeof llmApiKeySchemaApi>>;
export type WeaveApiKeyApi = WithId<z.infer<typeof weaveApiKeySchemaApi>>;
export type ApiKeyApi = WithId<z.infer<typeof apiKeySchemaApi>>;

// DB Types (with id and tenantId)
export type LlmApiKey = z.infer<typeof llmApiKeySchema>;
export function isLlmApiKey(apiKey: ApiKey): apiKey is LlmApiKey {
  return 'type' in apiKey && apiKey.type === 'llm-api-key';
}

export type ManagementApiKey = z.infer<typeof managementKeySchema>;
export type WeaveApiKey = z.infer<typeof weaveApiKeySchema>;
export type ApiKey = z.infer<typeof apiKeySchema>;
