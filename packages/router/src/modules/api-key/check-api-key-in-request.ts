import type { Request } from 'express';
import { ValidationError } from './errors/validation-error';
import type { ApiKey } from '@genie-nexus/database';
import { breakDownApiKey } from './utils/break-down-api-key';
import { getApiKeyRepository } from '../../core/db';
import { validateApiKey } from './secrets/validate-api-key';
import { ApiKeyNotPresentError } from './errors/api-key-not-present-error';
import { ApiKeyValidationError } from './errors/api-key-validation-error';

export async function checkApiKeyInRequest(
  req: Request<unknown, unknown>,
  type: ApiKey['type'],
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiKeyNotPresentError('Missing or invalid Authorization header');
  }

  const apiKey = authHeader.substring('Bearer '.length);

  try {
    const { keyId, keySecret } = breakDownApiKey(apiKey);

    const apiKeyRepository = await getApiKeyRepository();
    const storedApiKey = await apiKeyRepository.getById(keyId);
    if (!storedApiKey || storedApiKey.type !== type) {
      throw new ApiKeyValidationError('Invalid API key');
    }

    const validApiKey = await validateApiKey(
      keyId,
      storedApiKey.hash,
      keySecret,
    );
    if (!validApiKey) {
      throw new ApiKeyValidationError('Invalid API key');
    }

    return storedApiKey;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiKeyValidationError('Invalid API key');
    }
    throw error;
  }
}
