import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors/validation-error';
import { breakDownApiKey } from '../utils/break-down-api-key';
import { validateApiKey } from '../secrets/validate-api-key';
import { getApiKeyRepository } from '../../../core/db';
import type { ApiKey } from '../../../core/db/types';

export const checkApiKey =
  (type: ApiKey['type']) =>
  async (
    req: Request,
    res: Response<unknown, { apiKey: ApiKey }>,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res
        .status(401)
        .json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const apiKey = authHeader.substring('Bearer '.length);

    try {
      const { keyId, keySecret } = breakDownApiKey(apiKey);

      const apiKeyRepository = await getApiKeyRepository();
      const storedApiKey = await apiKeyRepository.getById(keyId);
      if (!storedApiKey || storedApiKey.type !== type) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }

      const validApiKey = await validateApiKey(
        keyId,
        storedApiKey.hash,
        keySecret,
      );
      if (!validApiKey) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }

      res.locals.apiKey = storedApiKey;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }
      throw error;
    }
  };
