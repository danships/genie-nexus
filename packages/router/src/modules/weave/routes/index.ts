import express from 'express';
import { processRequest } from './process-request.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { getTenantPath } from '../../tenants/get-tentant-path.js';

export function initialize(): express.Router {
  const router = express.Router();

  const tenantPath = getTenantPath();

  router.all(
    `/weave/${tenantPath}:deploymentName/*path`,
    getTenant,
    processRequest,
  );
  router.all(`/weave/${tenantPath}:deploymentName`, getTenant, processRequest);

  return router;
}
