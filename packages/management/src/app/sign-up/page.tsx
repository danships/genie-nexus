import { getServerConfiguration } from '@genie-nexus/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { ErrorPage } from '@lib/components/pages/error-page';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { SignUpClientPage } from './_page';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default async function SignUpPage() {
  await connection();

  const authMethod = await getAuthMethod();
  if (authMethod === 'none') {
    throw new Error('Authentication is not enabled');
  }

  if (!environment.MULTI_TENANT) {
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
      return <ErrorPage title="Sign Up" message="Sign up is not enabled." />;
    }
  } // else its multi-tenant and registration is always enabled

  return <SignUpClientPage />;
}
