import { arch, platform, release } from 'os';
import { getServerConfiguration } from '@genie-nexus/configuration';
import {
  Lifecycle,
  TypeSymbols,
  inject,
  scoped,
  singleton,
} from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import { backOff } from 'exponential-backoff';
import { GetApplicationInformation } from '../../core/get-application-information.js';
import { DEFAULT_TENANT_ID } from '../../index.js';
import { getConfiguration } from '../configuration/get-configuration.js';
import type { Events, TelemetryEvent } from './types.js';

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class SendTelemetryEvent {
  constructor(
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    @inject(GetApplicationInformation)
    private readonly getApplicationInformation: GetApplicationInformation,
    @inject(TypeSymbols.STORED_CONFIGURATION_REPOSITORY)
    private readonly storedConfigurationRepository: StoredConfigurationRepository
  ) {}

  private getOsInfo(): TelemetryEvent['os'] {
    return {
      platform: platform(),
      release: release(),
      arch: arch(),
      node: process.versions.node,
    };
  }

  private async createTelemetryEvent(
    event: Events,
    hash: string | undefined
  ): Promise<TelemetryEvent> {
    const applicationInformation =
      await this.getApplicationInformation.getApplicationInformation();
    return {
      version: 1,
      timestamp: new Date().toISOString(),
      os: this.getOsInfo(),
      software: {
        name: applicationInformation.name,
        version: applicationInformation.version,
        db: getConfiguration().db,
        runtimeEnvironment: getConfiguration().runtimeEnvironment,
      },
      details: event,
      hash:
        hash ??
        (
          await getServerConfiguration(
            this.storedConfigurationRepository,
            DEFAULT_TENANT_ID // Its disabled on multi-tenant anyway
          )
        ).server,
    };
  }

  public async sendEvent(event: Events, hash?: string): Promise<void> {
    try {
      if (getConfiguration().devMode) {
        this.logger.debug('Skipping telemetry event in dev mode', { event });
        return;
      }
      if (
        !(
          await getServerConfiguration(
            this.storedConfigurationRepository,
            DEFAULT_TENANT_ID
          )
        ).telemetryEnabled
      ) {
        this.logger.debug(
          'Skipping telemetry event because telemetry is disabled',
          { event }
        );
        return;
      }

      const telemetryEvent = await this.createTelemetryEvent(event, hash);

      this.logger.debug('Sending telemetry event', { event: telemetryEvent });

      backOff(
        async () => {
          const response = await fetch('https://www.gnxs.io/api/tm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          });

          if (!response.ok) {
            this.logger.info('Failed to send telemetry event', {
              status: response.status,
              statusText: response.statusText,
              body: await response.text(),
            });
            throw new Error('Failed to send telemetry event.');
          }

          this.logger.debug('Telemetry event sent successfully');
        },
        {
          retry: () => {
            this.logger.debug('Retrying telemetry event.');
            return true;
          },
        }
      );
    } catch (error) {
      this.logger.info('Final fail to send telemetry event', { error });
    }
  }
}
