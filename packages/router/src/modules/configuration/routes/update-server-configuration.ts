import {
  getServerConfiguration,
  updateServerConfiguration,
} from '@genie-nexus/configuration';
import { TypeSymbols, container } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type { ServerConfiguration } from '@genie-nexus/types';
import type { DataWrapper } from '@genie-nexus/types/dist/types/api.js';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import { getConfiguration } from '../get-configuration.js';

const requestValidator = z.object({
  telemetryEnabled: z.boolean(),
  registrationEnabled: z.boolean(),
});

export async function updateServerConfigurationHandler(
  req: Request,
  res: Response
) {
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
  const updatedConfiguration = await updateServerConfiguration(
    storedConfigurationRepository,
    tenant.id,
    parsedBody
  );

  res.json({
    data: updatedConfiguration,
  } satisfies DataWrapper<ServerConfiguration>);
  return;
}
