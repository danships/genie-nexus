'use server';

import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getNextAuthUserRepository } from '@lib/core/db';

let cachedUserExists: true | null = null;

export async function isAuthOnboardingRedirectNeeded(path: string) {
  if ((await getAuthMethod()) !== 'credentials') {
    return false;
  }

  if (cachedUserExists !== null) {
    return false;
  }

  if (
    path.startsWith('/onboarding') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/sign-up')
  ) {
    return false;
  }

  const userRepository = await getNextAuthUserRepository();
  const users = await userRepository.getByQuery(
    userRepository.createQuery().limit(1)
  );

  if (users.length > 0) {
    cachedUserExists = true;
    return false;
  }

  return true;
}
