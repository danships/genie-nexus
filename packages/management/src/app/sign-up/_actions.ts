'use server';

import { TypeSymbols } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import { auth } from '@lib/auth/auth';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getServerConfiguration } from '@lib/configuration';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import { headers } from 'next/headers';

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

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers: await headers(),
  });

  if (!result.user) {
    const logger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);
    logger.error('Sign-up failed: no user returned', { email });
    throw new Error('Sign-up failed. Please try again.');
  }

  if (newsletter) {
    await subscribeToNewsletter(email, result.user.id, 'sign-up', name);
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
