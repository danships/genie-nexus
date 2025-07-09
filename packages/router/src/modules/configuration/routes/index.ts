import express from 'express';
import { getHandlerUsingContainer } from '../../../core/http/get-handler-using-container.js';
import { checkApiKeyOrUser } from '../../api-key/middleware/check-api-key-or-user.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';
import { GetConfiguration } from './get-configuration.js';
import { GetServerConfiguration } from './get-server-configuration.js';
import { UpdateServerConfiguration } from './update-server-configuration.js';

export function initialize(): express.Router {
  const router = express.Router();

  router.get(
    '/api/v1/configuration',
    checkApiKeyOrUser('management-key'),
    getTenant,
    getHandlerUsingContainer(GetConfiguration)
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
