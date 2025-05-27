import { environment } from '@lib/environment';
import { connection } from 'next/server';
import type { AuthMethod } from './types';

export async function getAuthMethod(): Promise<AuthMethod> {
  await connection();
  if (environment.AUTH_METHOD === 'none') {
    return 'none';
  }
  return 'credentials';
}
