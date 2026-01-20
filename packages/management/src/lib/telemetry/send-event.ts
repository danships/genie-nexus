import { arch, platform, release } from 'node:os';
import { getServerConfiguration } from '@lib/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import { getAppVersion } from '@lib/api/get-app-version';
import { DEFAULT_TENANT_ID } from '@lib/api/middleware/constants';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import type { Events, TelemetryEvent } from './types';

function getOsInfo(): TelemetryEvent['os'] {
  return {
    platform: platform(),
    release: release(),
    arch: arch(),
    node: process.versions.node,
  };
}

function getDbType(): 'sqlite' | 'mysql' {
  return environment.DB.startsWith('mysql') ? 'mysql' : 'sqlite';
}

async function createTelemetryEvent(
  event: Events,
  hash: string | undefined,
  storedConfigurationRepository: StoredConfigurationRepository
): Promise<TelemetryEvent> {
  const applicationInfo = await getAppVersion();
  return {
    version: 1,
    timestamp: new Date().toISOString(),
    os: getOsInfo(),
    software: {
      name: applicationInfo.name,
      version: applicationInfo.version,
      db: getDbType(),
      runtimeEnvironment: environment.GNXS_RUNTIME_ENVIRONMENT as
        | 'cli'
        | 'docker',
    },
    details: event,
    hash:
      hash ??
      (
        await getServerConfiguration(
          storedConfigurationRepository,
          DEFAULT_TENANT_ID
        )
      ).server,
  };
}

async function sendWithRetry(
  telemetryEvent: TelemetryEvent,
  logger: Logger,
  maxRetries = 3
): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://www.gnxs.io/api/tm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telemetryEvent),
      });

      if (!response.ok) {
        logger.info('Failed to send telemetry event', {
          status: response.status,
          statusText: response.statusText,
          body: await response.text(),
        });
        throw new Error('Failed to send telemetry event.');
      }

      logger.debug('Telemetry event sent successfully');
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        logger.debug('Retrying telemetry event.');
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }
  }

  throw lastError;
}

export async function sendTelemetryEvent(
  event: Events,
  hash?: string
): Promise<void> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);
  const storedConfigurationRepository =
    container.resolve<StoredConfigurationRepository>(
      TypeSymbols.STORED_CONFIGURATION_REPOSITORY
    );

  try {
    if (environment.NODE_ENV === 'development') {
      logger.debug('Skipping telemetry event in dev mode', { event });
      return;
    }

    const serverConfig = await getServerConfiguration(
      storedConfigurationRepository,
      DEFAULT_TENANT_ID
    );
    if (!serverConfig.telemetryEnabled) {
      logger.debug('Skipping telemetry event because telemetry is disabled', {
        event,
      });
      return;
    }

    const telemetryEvent = await createTelemetryEvent(
      event,
      hash,
      storedConfigurationRepository
    );

    logger.debug('Sending telemetry event', { event: telemetryEvent });

    await sendWithRetry(telemetryEvent, logger);
  } catch (error) {
    logger.info('Final fail to send telemetry event', { error });
  }
}
