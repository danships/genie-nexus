import { container } from '@genie-nexus/container';
import {
  type CollectionEntityWithTenantId,
  entities,
} from '@genie-nexus/database';
import type { Request, Response } from 'express';
import type { Collection } from 'supersave';
import { SendTelemetryEvent } from '../../../../modules/telemetry/send-event.js';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response.js';

export default function (
  collection: Collection,
  _req: Request,
  res: Response,
  entity: Omit<CollectionEntityWithTenantId, 'id' | 'userId'>
): Omit<CollectionEntityWithTenantId, 'id'> {
  const tenant = getTenantFromResponse(res);

  if (
    [
      entities.Deployment.name,
      entities.Provider.name,
      entities.ApiKey.name,
      entities.LlmFlow.name,
      entities.WeaveFlow.name,
    ].includes(collection.name)
  ) {
    void container.resolve(SendTelemetryEvent).sendEvent({
      type: 'create',
      entity: collection.name,
    });
  }

  return {
    ...entity,
    tenantId: tenant.id,
  };
}
