import cors from 'cors';
import { Router, json } from 'express';
import { getHandlerUsingContainer } from '../../../core/http/get-handler-using-container.js';
import { checkApiKey } from '../../api-key/middleware/check-api-key.js';
import { URL_PARAM_DEPLOYMENT_SLUG } from '../../deployments/constants.js';
import { getTenantPath } from '../../tenants/get-tentant-path.js';
import { ChatCompletionHandler } from './chat-completion.js';

export function initialize(): Router {
  const router = Router();

  const tenantPath = getTenantPath();

  // Register chat completion route
  router.use(`/api/v1/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}/chat`, cors());
  router.post(
    `/api/v1/${tenantPath}:${URL_PARAM_DEPLOYMENT_SLUG}/chat/completions`,
    cors(),
    checkApiKey('llm-api-key'),
    json(),
    getHandlerUsingContainer(ChatCompletionHandler)
  );

  return router;
}
