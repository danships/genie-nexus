import type { CollectionEntityWithTenantId } from '@genie-nexus/database';
import type { Request, Response } from 'express';
import { type Collection, HookError } from 'supersave';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response.js';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: CollectionEntityWithTenantId
): CollectionEntityWithTenantId {
  const tenant = getTenantFromResponse(res);

  if (entity.tenantId !== tenant.id) {
    throw new HookError('Not authorized.', 401);
  }

  return entity;
}
