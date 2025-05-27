import type { NextFunction, Request, Response } from 'express';
import { getTenantRepository } from '../../../core/db/index.js';
import { getConfiguration } from '../../configuration/get-configuration.js';
import { RESPONSE_LOCALS_TENANT } from '../constants.js';
import { TenantMissingError } from '../errors/tenant-missing-error.js';
import { generateDefaultTenant } from '../generate-default-tenant.js';
import { requestHasParamTenantId } from './types.js';

export async function getTenant(
  // We explicitly do unknown so that it does not clash with other handlers in a route.
  req: Request<unknown, unknown>,
  res: Response,
  next: NextFunction
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
