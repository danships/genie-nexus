import type { Request, Response } from 'express';
import type { Collection } from 'supersave';
import { HookError } from 'supersave';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response';
import type { CollectionEntityWithTenantId } from '@genie-nexus/database';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: CollectionEntityWithTenantId | null,
): CollectionEntityWithTenantId | null {
  if (entity === null) {
    return null;
  }
  const tenant = getTenantFromResponse(res);

  if (entity.tenantId !== tenant.id) {
    throw new HookError('Cannot fetch this one.', 401);
  }
  return entity;
}
