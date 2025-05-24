import type { Request } from 'express';
import { ValidationError } from './errors/validation-error.js';
import type { ApiKey } from '@genie-nexus/database';
import { breakDownApiKey } from './utils/break-down-api-key.js';
import { getApiKeyRepository } from '../../core/db/index.js';
import { validateApiKey } from './secrets/validate-api-key.js';
import { ApiKeyNotPresentError } from './errors/api-key-not-present-error.js';
import { ApiKeyValidationError } from './errors/api-key-validation-error.js';
import { API_KEY_SILENT_LLM_PREFIX } from './constants.js';
import { logger } from '../../core/logger.js';

export async function checkApiKeyInRequest(
  req: Request<unknown, unknown>,
  type: ApiKey['type'],
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiKeyNotPresentError('Missing or invalid Authorization header');
  }

  let apiKey = authHeader.substring('Bearer '.length);
  if (apiKey.startsWith(API_KEY_SILENT_LLM_PREFIX)) {
    apiKey = apiKey.substring(API_KEY_SILENT_LLM_PREFIX.length);
  }

  try {
    const { keyId, keySecret } = breakDownApiKey(apiKey);

    const apiKeyRepository = await getApiKeyRepository();
    const storedApiKey = await apiKeyRepository.getById(keyId);
    if (!storedApiKey || storedApiKey.type !== type) {
      logger.warn('Stored api key not found, or no matching type.', {
        type: storedApiKey?.type,
        expected: type,
      });
      throw new ApiKeyValidationError('Invalid API key');
    }

    const validApiKey = await validateApiKey(
      keyId,
      storedApiKey.hash,
      keySecret,
    );
    if (!validApiKey) {
      logger.warn('API Key validation failed.');
      throw new ApiKeyValidationError('Invalid API key');
    }

    return storedApiKey;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiKeyValidationError('Invalid API key');
    }
    logger.warn('API Key validation failed because of an unknown error.', {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      error: error instanceof Error ? error.message : `${error}`,
    });
    throw error;
  }
}
