import type { ConfigurationResponse } from '@genie-nexus/types';
import express from 'express';
import { checkApiKeyOrUser } from '../../api-key/middleware/check-api-key-or-user.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { getConfiguration } from '../get-configuration.js';

export function initialize(): express.Router {
  const router = express.Router();

  router.get(
    '/api/v1/configuration',
    checkApiKeyOrUser('management-key'),
    getTenant,
    (_req, res) => {
      const tenant = getTenantFromResponse(res);

      res.json({
        data: {
          tenant,
          defaultTenant: tenant.id === DEFAULT_TENANT_ID,
          authentication: getConfiguration().authentication.type,
        },
      } satisfies ConfigurationResponse);
    }
  );

  return router;
}
