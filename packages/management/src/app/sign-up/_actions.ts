'use server';

import { saltAndHashPassword } from '@genie-nexus/auth';
import { getServerConfiguration } from '@genie-nexus/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type {
  NextAuthUserRepository,
  StoredConfigurationRepository,
} from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';

export async function doSignUp(
  name: string,
  email: string,
  password: string,
  newsletter: boolean
) {
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

  const user = await userRepository.create({
    name,
    email,
    password: await saltAndHashPassword(password),
    created: new Date().toISOString(),
    lastLogin: null,
    tenantId: DEFAULT_TENANT_ID,
  });

  if (newsletter) {
    await subscribeToNewsletter(email, user.id, 'sign-up', name);
  }
}

async function subscribeToNewsletter(
  email: string,
  userId: string,
  source: string,
  name?: string
) {
  const logger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);

  const requestData = {
    email,
    userId,
    source,
    name,
  };

  try {
    const response = await fetch(
      `${environment.NEWSLETTER_HOST}/api/v1/newsletter`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      logger.error('Failed to subscribe to newsletter', {
        status: response.status,
        text: await response.text(),
      });
    }
  } catch (error) {
    logger.error('Failed to subscribe to newsletter', { error });
  }
}
