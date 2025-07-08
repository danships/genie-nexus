'use server';

import { saltAndHashPassword } from '@genie-nexus/auth';
import { getServerConfiguration } from '@genie-nexus/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type {
  NextAuthUserRepository,
  StoredConfigurationRepository,
} from '@genie-nexus/database';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getContainer } from '@lib/core/get-container';

export async function doSignUp(name: string, email: string, password: string) {
  if ((await getAuthMethod()) === 'credentials') {
    const storedConfigurationRepository = (
      await getContainer()
    ).resolve<StoredConfigurationRepository>(
      TypeSymbols.STORED_CONFIGURATION_REPOSITORY
    );
    const configuration = await getServerConfiguration(
      storedConfigurationRepository,
      DEFAULT_TENANT_ID
    );
    if (!configuration.registrationEnabled) {
      throw new Error('Sign up is not enabled');
    }
  }
  const userRepository = (await getContainer()).resolve<NextAuthUserRepository>(
    TypeSymbols.NEXT_AUTH_USER_REPOSITORY
  );

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
