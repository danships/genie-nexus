import express from 'express';
import { processRequest } from './process-request';
import { getTenant } from '../../tenants/middleware/get-tenant';
import { getTenantPath } from '../../tenants/get-tentant-path';

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
