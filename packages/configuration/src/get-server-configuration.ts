import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type {
  ServerConfiguration,
  StoredConfiguration,
} from '@genie-nexus/types';
import { SERVER_CONFIGURATION_KEY } from './constants/keys.js';
import { SERVER_CONFIGURATION_KEYS } from './types.js';
import { updateServerConfiguration } from './update-server-configuration.js';

function getServerConfigurationValue<T>(
  configuration: StoredConfiguration | null,
  key: SERVER_CONFIGURATION_KEYS,
  defaultValue: T
): T {
  if (configuration?.values[key] === undefined) {
    return defaultValue;
  }

  const value = configuration?.values[key];
  if (typeof value !== typeof defaultValue) {
    return defaultValue;
  }
  return value as T;
}

export async function getServerConfiguration(
  storedConfigurationRepository: StoredConfigurationRepository,
  tenantId: string
): Promise<ServerConfiguration> {
  const configuration = await storedConfigurationRepository.getOneByQuery(
    storedConfigurationRepository
      .createQuery()
      .eq('tenantId', tenantId)
      .eq('key', SERVER_CONFIGURATION_KEY)
  );

  let generatedServerIdentifier: string | undefined;
  if (!configuration?.values[SERVER_CONFIGURATION_KEYS.SERVER_IDENTIFIER]) {
    // generate an identifier
    generatedServerIdentifier = crypto.randomUUID();
    await updateServerConfiguration(storedConfigurationRepository, tenantId, {
      server: generatedServerIdentifier,
    });
  }

  return {
    telemetryEnabled: getServerConfigurationValue(
      configuration,
      SERVER_CONFIGURATION_KEYS.TELEMETRY_ENABLED,
      true
    ),
    registrationEnabled: getServerConfigurationValue(
      configuration,
      SERVER_CONFIGURATION_KEYS.REGISTRATION_ENABLED,
      true
    ),
    server:
      generatedServerIdentifier ??
      String(
        configuration?.values[SERVER_CONFIGURATION_KEYS.SERVER_IDENTIFIER]
      ) ??
      '',
  };
}
