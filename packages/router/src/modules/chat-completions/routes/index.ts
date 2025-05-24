import express from 'express';
import { handler } from './chat-completion';
import cors from 'cors';
import { checkApiKey } from '../../api-key/middleware/check-api-key';
import { getTenantPath } from '../../tenants/get-tentant-path';
import { URL_PARAM_DEPLOYMENT_NAME } from '../../deployments/constants';

export function initialize(): express.Router {
  const router = express.Router();

  const tenantPath = getTenantPath();

  // Register chat completion route
  router.use(`/api/v1/${tenantPath}:${URL_PARAM_DEPLOYMENT_NAME}/chat`, cors());
  router.post(
    `/api/v1/${tenantPath}:deploymentName/chat/completions`,
    cors(),
    checkApiKey('llm-api-key'),
    express.json(),
    handler,
  );

  return router;
}
