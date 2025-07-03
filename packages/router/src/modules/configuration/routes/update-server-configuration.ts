import {
  getServerConfiguration,
  updateServerConfiguration,
} from '@genie-nexus/configuration';
import {
  Lifecycle,
  TypeSymbols,
  container,
  inject,
  scoped,
} from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { ServerConfiguration } from '@genie-nexus/types';
import type { DataWrapper } from '@genie-nexus/types/dist/types/api.js';
import type { Request, Response } from 'express';
import { z } from 'zod';
import type { HttpRequestHandler } from '../../../core/http/get-handler-using-container.js';
import { SendTelemetryEvent } from '../../telemetry/send-event.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import { getConfiguration } from '../get-configuration.js';

const requestValidator = z.object({
  telemetryEnabled: z.boolean().optional(),
  registrationEnabled: z.boolean().optional(),
});

@scoped(Lifecycle.ContainerScoped)
export class UpdateServerConfiguration implements HttpRequestHandler {
  constructor(
    @inject(SendTelemetryEvent)
    private readonly sendTelemetryEvent: SendTelemetryEvent
  ) {}

  public async handle(req: Request, res: Response) {
    const configuration = getConfiguration();
    const tenant = getTenantFromResponse(res);

    const storedConfigurationRepository =
      container.resolve<StoredConfigurationRepository>(
        TypeSymbols.STORED_CONFIGURATION_REPOSITORY
      );

    if (configuration.multiTenant) {
      res.json({
        // TODO implement this properly on multi-tenancy
        data: await getServerConfiguration(
          storedConfigurationRepository,
          tenant.id
        ),
      } satisfies DataWrapper<ServerConfiguration>);
      return;
    }

    const parsedBody = requestValidator.parse(req.body);

    if (Object.keys(parsedBody).length === 0) {
      const currentConfiguration = await getServerConfiguration(
        storedConfigurationRepository,
        tenant.id
      );
      res.json({
        data: currentConfiguration,
      } satisfies DataWrapper<ServerConfiguration>);
      return;
    }

    const configurationUpdates: Partial<ServerConfiguration> = {};

    if (parsedBody.telemetryEnabled !== undefined) {
      configurationUpdates.telemetryEnabled = parsedBody.telemetryEnabled;
      if (!parsedBody.telemetryEnabled) {
        void this.sendTelemetryEvent.sendEvent({
          type: 'telemetry-disabled',
        });
      }
      if (parsedBody.telemetryEnabled) {
        configurationUpdates.server = crypto.randomUUID();
        void this.sendTelemetryEvent
          .sendEvent(
            {
              type: 'telemetry-enabled',
            },
            configurationUpdates.server
          )
          .then(() =>
            this.sendTelemetryEvent.sendEvent(
              { type: 'registered' },
              configurationUpdates.server
            )
          );
      }
    }

    if (parsedBody.registrationEnabled !== undefined) {
      configurationUpdates.registrationEnabled = parsedBody.registrationEnabled;
    }

    const updatedConfiguration = await updateServerConfiguration(
      storedConfigurationRepository,
      tenant.id,
      configurationUpdates
    );

    res.json({
      data: updatedConfiguration,
    } satisfies DataWrapper<ServerConfiguration>);
    return;
  }
}
