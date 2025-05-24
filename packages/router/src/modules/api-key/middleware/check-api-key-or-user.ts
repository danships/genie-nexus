import type { NextFunction, Request, Response } from 'express';
import type { ApiKey } from '@genie-nexus/database';
import { checkApiKey } from './check-api-key.js';
import { API_KEY_PREFIX } from '../constants.js';
import { ApplicationError } from '../../../core/errors/application-error.js';
import { getConfiguration } from '../../configuration/get-configuration.js';
import { logger } from '../../../core/logger.js';

export const checkApiKeyOrUser =
  (type: ApiKey['type']) =>
  async (
    req: Request,
    res: Response<unknown, { apiKey: ApiKey }>,
    next: NextFunction,
  ) => {
    if (getConfiguration().authentication.type === 'none') {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (authHeader?.toLowerCase().startsWith(API_KEY_PREFIX)) {
      // Use API key middleware for api key prefixed tokens
      return checkApiKey(type)(req, res, next);
    }

    const { getSession } = await import('../../auth/next-auth/get-session.js');

    const session = await getSession(req, res);
    if (!session?.user) {
      logger.warn('Unauthorized, no user in session.');
      throw new ApplicationError('Unauthorized', 401);
    }

    next();
  };
