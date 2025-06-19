import { Router } from 'express';
import { getHandlerUsingContainer } from '../../../core/http/get-handler-using-container.js';
import { URL_PARAM_DEPLOYMENT_SLUG } from '../../deployments/constants.js';
import { getTenantPath } from '../../tenants/get-tentant-path.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { ProcessRequest } from './process-request.js';

export function initialize(): Router {
  const router = Router();

  const tenantPath = getTenantPath();

  router.all(
    `/weave/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}/*path`,
    getTenant,
    getHandlerUsingContainer(ProcessRequest)
  );
  router.all(
    `/weave/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}`,
    getTenant,
    getHandlerUsingContainer(ProcessRequest)
  );

  return router;
}
