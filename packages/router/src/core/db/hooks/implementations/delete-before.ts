import type { CollectionEntityWithTenantId } from '@genie-nexus/database';
import type { Request, Response } from 'express';
import { type Collection, HookError } from 'supersave';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response.js';
import { getLogger } from '../../../get-logger.js';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: CollectionEntityWithTenantId | null
): void {
  if (entity === null) {
    return;
  }
  const tenant = getTenantFromResponse(res);

  const logger = getLogger();

  // Check if the item we are deleting belongs to this user.
  if (entity.tenantId !== tenant.id) {
    logger.warning('Unauthorized, tenant id mismatch.', {
      entityTenantId: entity.tenantId,
      tenantId: tenant.id,
    });
    throw new HookError('Not authorized.', 401);
  }
}
