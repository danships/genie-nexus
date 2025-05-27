import type { ApiKey } from '@genie-nexus/database';
import type { Response } from 'express';

export function getApiKeyFromResponse(
  response: Response,
  expectedType: ApiKey['type']
) {
  if (!response.locals['apiKey']) {
    throw new Error('API key not found');
  }

  const apiKey = response.locals['apiKey'] as ApiKey;

  if (apiKey.type !== expectedType) {
    throw new Error('API key type mismatch');
  }

  return response.locals['apiKey'] as ApiKey;
}
