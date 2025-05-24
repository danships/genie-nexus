import type { Request, Response } from 'express';
import type { Collection } from 'supersave';
import { getTenantFromResponse } from '../../../../modules/tenants/get-tenant-from-response.js';

export default function get(
  _collection: Collection,
  req: Request,
  res: Response,
): void {
  const tenant = getTenantFromResponse(res);

  req.query['tenantId'] = tenant.id;
}
