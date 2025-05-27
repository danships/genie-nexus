import type { ApiKey } from '@genie-nexus/database';
import type { NextFunction, Request, Response } from 'express';
import { checkApiKeyInRequest } from '../check-api-key-in-request.js';
import { ApiKeyNotPresentError } from '../errors/api-key-not-present-error.js';
import { ApiKeyValidationError } from '../errors/api-key-validation-error.js';

export const checkApiKey =
  (type: ApiKey['type']) =>
  async (
    req: Request,
    res: Response<unknown, { apiKey: ApiKey }>,
    next: NextFunction
  ) => {
    try {
      const apiKey = await checkApiKeyInRequest(req, type);
      res.locals.apiKey = apiKey;
      next();
    } catch (error) {
      if (
        error instanceof ApiKeyValidationError ||
        error instanceof ApiKeyNotPresentError
      ) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }
      throw error;
    }
  };
