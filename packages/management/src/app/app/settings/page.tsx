import { getServerConfiguration } from '@genie-nexus/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { ServerConfiguration } from '@genie-nexus/types';
import { getResponseFromApi } from '@lib/api/server-api';
import { DEFAULT_TENANT_ID } from '@lib/auth/constants';
import { UserRequired } from '@lib/components/molecules/user-required';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import { SettingsClientPage } from './_page';

export const metadata = {
  title: 'Settings',
};

async function getStoredServerConfiguration(): Promise<ServerConfiguration> {
  if (!environment.MULTI_TENANT) {
    const storedConfigurationRepository = (
      await getContainer()
    ).resolve<StoredConfigurationRepository>(
      TypeSymbols.STORED_CONFIGURATION_REPOSITORY
    );
    return getServerConfiguration(
      storedConfigurationRepository,
      DEFAULT_TENANT_ID
    );
  }

  // We retrieve the server settings from the router, not the database, so that the
  // tenantId is automatically set correctly.
  return await getResponseFromApi<ServerConfiguration>('/configuration/server');
}

export default async function SettingsPage() {
  const configuration = await getStoredServerConfiguration();

  return (
    <UserRequired>
      <SettingsClientPage serverConfiguration={configuration} />
    </UserRequired>
  );
}
