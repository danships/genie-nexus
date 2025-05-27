import type { ApiKey } from '@genie-nexus/database';
import type {
  LlmApiKey,
  ManagementApiKey,
  WeaveApiKey,
} from '@genie-nexus/types';
import { getApiKeyRepository } from '../../core/db/index.js';
import {
  API_KEY_PREFIX,
  API_KEY_SILENT_LLM_PREFIX,
  ID_SEPARATOR,
} from './constants.js';
import { generateApiKey } from './secrets/generate-api-key.js';

const KEY_PREVIEW_LENGTH = 12;

async function generateApiKeyHelper(
  apiKeyToCreate: Omit<ApiKey, 'id'>,
  keyPrefix: string = ''
): Promise<string> {
  const apiKeyRepository = await getApiKeyRepository();

  const createdApiKey = await apiKeyRepository.create(apiKeyToCreate);

  const { secret, hash } = await generateApiKey(createdApiKey.id ?? '');
  const generatedApiKey = `${keyPrefix}${API_KEY_PREFIX}${createdApiKey.id}${ID_SEPARATOR}${secret}`;

  await apiKeyRepository.update({
    ...createdApiKey,
    hash,
    keyPreview: generatedApiKey.slice(0, KEY_PREVIEW_LENGTH),
  });

  return generatedApiKey;
}

export function generateLlmApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[]
) {
  const apiKeyToCreate: Omit<LlmApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'llm-api-key',
    hash: '',
    keyPreview: '',
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate['allowedDeployments'] = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate, API_KEY_SILENT_LLM_PREFIX);
}

export function generateWeaveApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[]
) {
  const apiKeyToCreate: Omit<WeaveApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'weave-api-key',
    hash: '',
    keyPreview: '',
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate['allowedDeployments'] = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate);
}

export function generateManagementApiKey(
  tenantId: string,
  label: string,
  scopes: string[]
): Promise<string> {
  const apiKeyToCreate: Omit<ManagementApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'management-key',
    hash: '',
    keyPreview: '',
    scopes,
    createdAt: new Date().toISOString(),
  };

  return generateApiKeyHelper(apiKeyToCreate);
}
