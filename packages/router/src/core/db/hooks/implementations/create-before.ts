import type { Request, Response } from 'express';
import type { Collection } from 'supersave';
import type { CollectionEntityWithTenantId } from '../../types';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response';

export default function (
  _collection: Collection,
  _req: Request,
  res: Response,
  entity: Omit<CollectionEntityWithTenantId, 'id' | 'userId'>,
): Omit<CollectionEntityWithTenantId, 'id'> {
  const tenant = getTenantFromResponse(res);

  return {
    ...entity,
    tenantId: tenant.id,
  };
}
