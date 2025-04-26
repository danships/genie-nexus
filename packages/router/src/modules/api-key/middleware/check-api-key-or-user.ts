import type { NextFunction, Request, Response } from 'express';
import type { ApiKey } from '../../../core/db/types';
import { checkApiKey } from './check-api-key';
import { API_KEY_PREFIX } from '../constants';

export const checkApiKeyOrUser =
  (type: ApiKey['type']) =>
  async (
    req: Request,
    res: Response<unknown, { apiKey: ApiKey }>,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.toLowerCase().startsWith(API_KEY_PREFIX)) {
      // Use API key middleware for api key prefixed tokens
      return checkApiKey(type)(req, res, next);
    }

    // TODO: Implement user authentication fallback
    // For now, just continue without authentication
    next();
  };
