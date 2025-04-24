import express from 'express';
import { handler } from './chat-completion';
import cors from 'cors';
import { checkApiKey } from '../../api-key/middleware/check-api-key';

export function initialize(): express.Router {
  const router = express.Router();

  // Register chat completion route
  router.use('/api/v1/chat', cors());
  router.post(
    '/api/v1/chat/completions',
    cors(),
    checkApiKey('llm-api-key'),
    express.json(),
    handler,
  );

  return router;
}
