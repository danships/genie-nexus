import type { Request, Response, NextFunction } from 'express';
import { getConfiguration } from '../../configuration/get-configuration';
import { generateDefaultTenant } from '../generate-default-tenant';
import { requestHasParamTenantId } from './types';
import { TenantMissingError } from '../errors/tenant-missing-error';
import { getTenantRepository } from '../../../core/db';
import { RESPONSE_LOCALS_TENANT } from '../constants';

export async function getTenant(
  // We explicitly do unknown so that it does not clash with other handlers in a route.
  req: Request<unknown, unknown>,
  res: Response,
  next: NextFunction,
) {
  if (!getConfiguration().multiTenant) {
    res.locals[RESPONSE_LOCALS_TENANT] = generateDefaultTenant();
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

  res.locals[RESPONSE_LOCALS_TENANT] = tenant;
  next();
}
