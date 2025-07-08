'use server';

import { TypeSymbols } from '@genie-nexus/container';
import type { NextAuthUserRepository } from '@genie-nexus/database';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getContainer } from '@lib/core/get-container';

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

  const userRepository = (await getContainer()).resolve<NextAuthUserRepository>(
    TypeSymbols.NEXT_AUTH_USER_REPOSITORY
  );
  const users = await userRepository.getByQuery(
    userRepository.createQuery().limit(1)
  );

  if (users.length > 0) {
    cachedUserExists = true;
    return false;
  }

  return true;
}
