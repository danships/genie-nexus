import type { CollectionEntityWithTenantId } from '@genie-nexus/database';
import type { Request, Response } from 'express';
import type { Collection } from 'supersave';
import { HookError } from 'supersave';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response.js';
import { logger } from '../../../logger.js';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: CollectionEntityWithTenantId | null
): CollectionEntityWithTenantId | null {
  if (entity === null) {
    return null;
  }
  const tenant = getTenantFromResponse(res);

  if (entity.tenantId !== tenant.id) {
    logger.warn('Unauthorized, tenant id mismatch.', {
      entityTenantId: entity.tenantId,
      tenantId: tenant.id,
    });
    throw new HookError('Cannot fetch this one.', 401);
  }
  return entity;
}
