import { API_KEY_PREFIX, ID_SEPARATOR } from '../constants.js';

export function breakDownApiKey(apiKey: string): {
  keyId: string;
  keySecret: string;
} {
  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    throw new Error('Invalid API key');
  }

  const keyPattern = new RegExp(`^${API_KEY_PREFIX}(.*)${ID_SEPARATOR}(.*)`);
  const match = apiKey.match(keyPattern);
  if (!match) {
    throw new Error('Invalid API key');
  }

  const [, keyId, keySecret] = match;
  if (!keyId || !keySecret) {
    throw new Error('Invalid API key');
  }

  return {
    keyId,
    keySecret,
  };
}
