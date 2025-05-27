'use server';

import { saltAndHashPassword } from '@genie-nexus/auth';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { getNextAuthUserRepository } from '@lib/core/db';

export async function doSignUp(name: string, email: string, password: string) {
  const userRepository = await getNextAuthUserRepository();

  const existingUser = await userRepository.getOneByQuery(
    userRepository.createQuery().eq('email', email)
  );

  if (existingUser) {
    throw new Error('User already exists');
  }

  await userRepository.create({
    name,
    email,
    password: await saltAndHashPassword(password),
    created: new Date().toISOString(),
    lastLogin: null,
    tenantId: DEFAULT_TENANT_ID,
  });
}
