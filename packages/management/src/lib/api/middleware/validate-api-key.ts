import * as argon2 from 'argon2';

export async function validateApiKey(
  id: string,
  hash: string,
  secret: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, `${secret}${id}`);
  } catch {
    return false;
  }
}
