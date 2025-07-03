import { getServerConfiguration as getStoredServerConfiguration } from '@genie-nexus/configuration';
import {
  Lifecycle,
  TypeSymbols,
  container,
  scoped,
} from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { ServerConfigurationResponse } from '@genie-nexus/types';
import type { DataWrapper } from '@genie-nexus/types/dist/types/api.js';
import type { Request, Response } from 'express';
import type { HttpRequestHandler } from '../../../core/http/get-handler-using-container.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';
import { getConfiguration } from '../get-configuration.js';

@scoped(Lifecycle.ContainerScoped)
export class GetServerConfiguration implements HttpRequestHandler {
  public async handle(_req: Request, res: Response) {
    const configuration = getConfiguration();

    if (configuration.multiTenant) {
      res.json({
        data: {
          telemetryEnabled: true, // TODO find a way to determine this from a tenantId, optionally.
          registrationEnabled: true,
        },
      } satisfies DataWrapper<ServerConfigurationResponse>);
      return;
    }

    const storedConfigurationRepository =
      container.resolve<StoredConfigurationRepository>(
        TypeSymbols.STORED_CONFIGURATION_REPOSITORY
      );

    const serverConfiguration = await getStoredServerConfiguration(
      storedConfigurationRepository,
      DEFAULT_TENANT_ID
    );

    res.json({
      data: serverConfiguration,
    } satisfies DataWrapper<ServerConfigurationResponse>);
    return;
  }
}
