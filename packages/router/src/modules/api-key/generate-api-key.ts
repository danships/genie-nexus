import { getApiKeyRepository } from '../../core/db';
import type { ApiKey } from '@genie-nexus/database';
import { API_KEY_PREFIX, ID_SEPARATOR } from './constants';
import { generateApiKey } from './secrets/generate-api-key';
import type {
  LlmApiKey,
  ManagementApiKey,
  WeaveApiKey,
} from '../../../../types/dist';

async function generateApiKeyHelper(
  apiKeyToCreate: Omit<ApiKey, 'id'>,
): Promise<string> {
  const apiKeyRepository = await getApiKeyRepository();

  const createdApiKey = await apiKeyRepository.create(apiKeyToCreate);

  const { secret, hash } = await generateApiKey(createdApiKey.id ?? '');
  await apiKeyRepository.update({ ...createdApiKey, hash });

  return `${API_KEY_PREFIX}${createdApiKey.id}${ID_SEPARATOR}${secret}`;
}

export async function generateLlmApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[],
) {
  const apiKeyToCreate: Omit<LlmApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'llm-api-key',
    hash: '',
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate['allowedDeployments'] = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate);
}

export async function generateWeaveApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[],
) {
  const apiKeyToCreate: Omit<WeaveApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'weave-api-key',
    hash: '',
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate['allowedDeployments'] = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate);
}

export async function generateManagementApiKey(
  tenantId: string,
  label: string,
  scopes: string[],
): Promise<string> {
  const apiKeyToCreate: Omit<ManagementApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'management-key',
    hash: '',
    scopes,
    createdAt: new Date().toISOString(),
  };

  return generateApiKeyHelper(apiKeyToCreate);
}
