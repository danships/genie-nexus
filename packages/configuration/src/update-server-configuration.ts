import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type {
  ServerConfiguration,
  StoredConfiguration,
} from '@genie-nexus/types';
import { SERVER_CONFIGURATION_KEY } from './constants/keys.js';
import { SERVER_CONFIGURATION_KEYS } from './types.js';

export async function updateServerConfiguration(
  storedConfigurationRepository: StoredConfigurationRepository,
  tenantId: string,
  configuration: Partial<ServerConfiguration>
): Promise<ServerConfiguration> {
  const existingConfiguration =
    await storedConfigurationRepository.getOneByQuery(
      storedConfigurationRepository
        .createQuery()
        .eq('tenantId', tenantId)
        .eq('key', SERVER_CONFIGURATION_KEY)
    );

  const updatedValues: StoredConfiguration['values'] = {
    ...existingConfiguration?.values,
  };

  if (configuration.telemetryEnabled !== undefined) {
    updatedValues[SERVER_CONFIGURATION_KEYS.TELEMETRY_ENABLED] = Boolean(
      configuration.telemetryEnabled
    );
  }

  if (configuration.registrationEnabled !== undefined) {
    updatedValues[SERVER_CONFIGURATION_KEYS.REGISTRATION_ENABLED] = Boolean(
      configuration.registrationEnabled
    );
  }

  if (existingConfiguration) {
    await storedConfigurationRepository.update({
      ...existingConfiguration,
      values: updatedValues,
    });
  } else {
    await storedConfigurationRepository.create({
      tenantId,
      values: updatedValues,
      key: SERVER_CONFIGURATION_KEY,
    });
  }

  return {
    telemetryEnabled: Boolean(
      updatedValues[SERVER_CONFIGURATION_KEYS.TELEMETRY_ENABLED]
    ),
    registrationEnabled: Boolean(
      updatedValues[SERVER_CONFIGURATION_KEYS.REGISTRATION_ENABLED]
    ),
  };
}
