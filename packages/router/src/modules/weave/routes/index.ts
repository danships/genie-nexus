import express from 'express';
import { processRequest } from './process-request';

export function initialize(): express.Router {
  const router = express.Router();

  router.all('/weave/:tenantId/:deploymentName/*path', processRequest);
  router.all('/weave/:tenantId/:deploymentName', processRequest);

  return router;
}
