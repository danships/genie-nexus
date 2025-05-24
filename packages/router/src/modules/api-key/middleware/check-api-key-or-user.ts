import type { NextFunction, Request, Response } from 'express';
import type { ApiKey } from '@genie-nexus/database';
import { checkApiKey } from './check-api-key';
import { API_KEY_PREFIX } from '../constants';
import { ApplicationError } from '../../../core/errors/application-error';
import { getConfiguration } from '../../configuration/get-configuration';
import { logger } from '../../../core/logger';

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

    const { getSession } = await import('../../auth/next-auth/get-session.mjs');

    const session = await getSession(req, res);
    if (!session?.user) {
      logger.warn('Unauthorized, no user in session.');
      throw new ApplicationError('Unauthorized', 401);
    }

    next();
  };
