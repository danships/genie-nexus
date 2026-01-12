import { API_KEY_PREFIX, ID_SEPARATOR } from './constants';
import { ValidationError } from './errors';

export function breakDownApiKey(apiKey: string): {
  keyId: string;
  keySecret: string;
} {
  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    throw new ValidationError('Invalid API key');
  }

  const keyPattern = new RegExp(`^${API_KEY_PREFIX}(.*)${ID_SEPARATOR}(.*)`);
  const match = apiKey.match(keyPattern);
  if (!match) {
    throw new ValidationError('Invalid API key');
  }

  const [, keyId, keySecret] = match;
  if (!keyId || !keySecret) {
    throw new ValidationError('Invalid API key');
  }

  return {
    keyId,
    keySecret,
  };
}
