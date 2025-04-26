import express from 'express';
import { processRequest } from './process-request';
import { getTenant } from '../../tenants/middleware/get-tenant';
import { getConfiguration } from '../../../core/configuration/get';
import { URL_PARAM_TENANT_ID } from '../../tenants/constants';

export function initialize(): express.Router {
  const router = express.Router();

  const tenantPath = getConfiguration().multiTenant
    ? `:${URL_PARAM_TENANT_ID}/`
    : '';

  router.all(
    `/weave/${tenantPath}:deploymentName/*path`,
    getTenant,
    processRequest,
  );
  router.all(`/weave/${tenantPath}:deploymentName`, getTenant, processRequest);

  return router;
}
