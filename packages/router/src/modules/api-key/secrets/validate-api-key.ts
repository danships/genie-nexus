import * as argon2 from 'argon2';
import { logger } from '../../../core/logger';

/**
 * Validates if a provided secret matches the stored hash for a given ID
 * @param id - The unique identifier for the API key
 * @param hash - The stored hash to validate against
 * @param secret - The provided secret to validate
 * @returns boolean indicating whether the secret is valid
 */
export async function validateApiKey(
  id: string,
  hash: string,
  secret: string,
): Promise<boolean> {
  try {
    // Verify the hash using Argon2
    // Note: The salt and other parameters are embedded in the hash string
    return await argon2.verify(hash, `${secret}${id}`);
  } catch (error) {
    logger.warning('Failed to validate API key', { error });
    return false;
  }
}
