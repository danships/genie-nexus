import { Router } from 'express';
import { URL_PARAM_DEPLOYMENT_SLUG } from '../../deployments/constants.js';
import { getTenantPath } from '../../tenants/get-tentant-path.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { processRequest } from './process-request.js';

export function initialize(): Router {
  const router = Router();

  const tenantPath = getTenantPath();

  router.all(
    `/weave/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}/*path`,
    getTenant,
    processRequest
  );
  router.all(
    `/weave/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}`,
    getTenant,
    processRequest
  );

  return router;
}
