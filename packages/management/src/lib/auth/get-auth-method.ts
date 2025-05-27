import { environment } from '@lib/environment';
import type { AuthMethod } from './types';
import { connection } from 'next/server';

export async function getAuthMethod(): Promise<AuthMethod> {
  await connection();
  if (
    environment.AUTH_METHOD === 'none' ||
    process.env['IS_BUILD'] === 'true'
  ) {
    return 'none';
  }
  return 'credentials';
}
