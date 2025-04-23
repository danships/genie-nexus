import express from 'express';
import { handler } from './chat-completion';
import cors from 'cors';

export function initialize(): express.Router {
  const router = express.Router();

  // Register chat completion route
  router.options('/api/v1/chat/completions', cors());
  router.post('/api/v1/chat/completions', cors(), express.json(), handler);

  return router;
}
