import express from 'express';
import type { Router } from 'express';
import { checkApiKeyOrUser } from '../middleware/check-api-key-or-user.js';
import { createApiKey } from './create-api-key.js';
import { getTenant } from '../../tenants/middleware/get-tenant.js';

export function initialize(): Router {
  const router = express.Router();

  router.use(express.json(), getTenant);
  router.post(
    '/api/v1/api-keys',
    checkApiKeyOrUser('management-key'),
    createApiKey,
  );

  return router;
}
