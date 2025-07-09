import { Lifecycle, inject, scoped } from '@genie-nexus/container';
import type { ConfigurationResponse } from '@genie-nexus/types';
import type { Request, Response } from 'express';
import { GetApplicationInformation } from '../../../core/get-application-information.js';
import type { HttpRequestHandler } from '../../../core/http/get-handler-using-container.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import { getConfiguration } from '../get-configuration.js';

@scoped(Lifecycle.ContainerScoped)
export class GetConfiguration implements HttpRequestHandler {
  constructor(
    @inject(GetApplicationInformation)
    private readonly getApplicationInformation: GetApplicationInformation
  ) {}

  public async handle(_req: Request, res: Response) {
    const tenant = getTenantFromResponse(res);
    const applicationInfo =
      await this.getApplicationInformation.getApplicationInformation();

    res.json({
      data: {
        tenant,
        defaultTenant: tenant.id === DEFAULT_TENANT_ID,
        authentication: getConfiguration().authentication.type,
        version: applicationInfo.version,
      },
    } satisfies ConfigurationResponse);
  }
}
