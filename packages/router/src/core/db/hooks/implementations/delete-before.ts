import type { Request, Response } from 'express';
import { type Collection, HookError } from 'supersave';
import type { CollectionEntityWithTenantId } from '@genie-nexus/database';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: CollectionEntityWithTenantId | null,
): void {
  if (entity === null) {
    return;
  }
  const tenant = getTenantFromResponse(res);

  // Check if the item we are deleting belongs to this user.
  if (entity.tenantId !== tenant.id) {
    throw new HookError('Not authorized.', 401);
  }
}
