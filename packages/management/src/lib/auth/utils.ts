import argon2 from 'argon2';

export async function saltAndHashPassword(password: string): Promise<string> {
  // Generate a hash using argon2
  const hash: string = await argon2.hash(password);
  return hash;
}

export async function verifyUsingHashedPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // Verify the password against the hash
  return await argon2.verify(hash, password);
}

export const isDev = () => process.env['NODE_ENV'] === 'development';

export const logger = isDev() ? console.log : () => {};
