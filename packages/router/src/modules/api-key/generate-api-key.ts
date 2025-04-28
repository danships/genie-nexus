import { getApiKeyRepository } from '../../core/db';
import type { ApiKey } from '@genie-nexus/database';
import { API_KEY_PREFIX, ID_SEPARATOR } from './constants';
import { generateApiKey } from './secrets/generate-api-key';

async function generatApiKeyHelper(
  apiKeyToCreate: Omit<ApiKey, 'id'>,
): Promise<string> {
  const apiKeyRepository = await getApiKeyRepository();

  const createdApiKey = await apiKeyRepository.create(apiKeyToCreate);

  const { secret, hash } = await generateApiKey(createdApiKey.id ?? '');
  await apiKeyRepository.update({ ...createdApiKey, hash });

  return `${API_KEY_PREFIX}${createdApiKey.id}${ID_SEPARATOR}${secret}`;
}

export async function generatePublicApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[],
) {
  const apiKeyToCreate: Omit<ApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'llm-api-key',
    hash: '',
  };
  if (allowedDeployments) {
    apiKeyToCreate['allowedDeployments'] = allowedDeployments;
  }

  return generatApiKeyHelper(apiKeyToCreate);
}

export async function generateManagementApiKey(
  tenantId: string,
  label: string,
  scopes: string[],
): Promise<string> {
  const apiKeyToCreate: Omit<ApiKey, 'id'> = {
    tenantId,
    label,
    active: true,
    type: 'management-key',
    hash: '',
    scopes,
  };

  return generatApiKeyHelper(apiKeyToCreate);
}
