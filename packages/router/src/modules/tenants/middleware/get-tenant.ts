import type { Request, Response, NextFunction } from 'express';
import { getConfiguration } from '../../../core/configuration/get';
import { generateDefaultTenant } from '../generate-default-tenant';
import { requestHasParamTenantId } from './types';
import { TenantMissingError } from '../errors/tenant-missing-error';
import { getTenantRepository } from '../../../core/db';

export async function getTenant(
  // We explicitly do unknown so that it does not clash with other handlers in a route.
  req: Request<unknown, unknown>,
  res: Response,
  next: NextFunction,
) {
  if (!getConfiguration().multiTenant) {
    res.locals['tenant'] = generateDefaultTenant();
    return next();
  }

  if (!requestHasParamTenantId(req)) {
    throw new TenantMissingError();
  }

  const tenantRepository = await getTenantRepository();
  const tenant = await tenantRepository.getById(req.params.tenantId);
  if (!tenant) {
    throw new TenantMissingError();
  }

  res.locals['tenant'] = tenant;
  next();
}
