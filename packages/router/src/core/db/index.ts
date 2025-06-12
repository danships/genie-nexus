import { initialize as initializeDB } from '@genie-nexus/database';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import type { SuperSave } from 'supersave';
import { checkApiKeyOrUser } from '../../modules/api-key/middleware/check-api-key-or-user.js';
import { getTenant } from '../../modules/tenants/middleware/get-tenant.js';
import { getHooksForCollection } from './hooks/get-hooks-for-collection.js';

export {
  getDB,
  getApiKeyRepository,
  getDeploymentRepository,
  getProviderRepository,
  getTenantRepository,
  getWeaveFlowRepository,
} from '@genie-nexus/database';

export function initialize(
  connectionString: string,
  app: Application
): Promise<SuperSave> {
  const router = express.Router();

  // TODO validate the tenant for requests, does the api key tenant match the request tenant?
  // TODO for management api keys, we should check the scopes
  app.use(
    '/api/v1/collections',
    cors(),
    express.json(),
    checkApiKeyOrUser('management-key'),
    getTenant,
    router
  );

  return initializeDB({
    connectionString,
    executeMigrations: true,
    hooks: getHooksForCollection(),
    app: router,
  });
}
