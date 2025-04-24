import crypto from 'crypto';
import * as argon2 from 'argon2';

export type ApiKeyGenerationResult = {
  secret: string;
  hash: string;
};

/**
 * Generates a secure API key and its corresponding hash
 * @param id - The unique identifier for the API key
 * @param secret - Optional pre-generated secret to use instead of generating a new one
 * @returns An object containing the secret API key and its hash
 */
export async function generateApiKey(
  id: string,
): Promise<ApiKeyGenerationResult> {
  // Generate a random 32-byte secret
  const secret = crypto.randomBytes(32).toString('hex');

  // Create a hash using Argon2 with the secret and id
  // Argon2 will automatically generate and embed a unique salt
  const hash = await argon2.hash(`${secret}${id}`, {
    type: argon2.argon2id, // Use Argon2id variant (recommended)
    memoryCost: 65536, // 64MB memory usage
    timeCost: 3, // Number of iterations
    parallelism: 4, // Number of parallel threads
    hashLength: 32, // Output hash length in bytes
  });

  return {
    secret,
    hash,
  };
}
