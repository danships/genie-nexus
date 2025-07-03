import type { ConfigurationResponse } from '@genie-nexus/types';
import express from 'express';
import { getHandlerUsingContainer } from '../../../core/http/get-handler-using-container.js';
import { checkApiKeyOrUser } from '../../api-key/middleware/check-api-key-or-user.js';
import { DEFAULT_TENANT_ID } from '../../tenants/constants.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { getConfiguration } from '../get-configuration.js';
import { GetServerConfiguration } from './get-server-configuration.js';
import { UpdateServerConfiguration } from './update-server-configuration.js';

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

  router.get(
    '/api/v1/configuration/server',
    getHandlerUsingContainer(GetServerConfiguration)
  );
  router.post(
    '/api/v1/configuration/server',
    checkApiKeyOrUser('management-key'),
    getTenant,
    getHandlerUsingContainer(UpdateServerConfiguration)
  );

  return router;
}
