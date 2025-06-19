import type { NextFunction, Request, Response } from 'express';
import { UNIQUE_ID_LOCAL_KEY } from './constants.js';

export function uniqueIdMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals[UNIQUE_ID_LOCAL_KEY] = crypto.randomUUID().slice(0, 8);
  res.header('x-gnxs-id', res.locals[UNIQUE_ID_LOCAL_KEY]);
  next();
}
