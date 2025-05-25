import { isResponseLocalsAuthSession } from './types.js';
import type { Response, Request } from 'express';

import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '@genie-nexus/auth';

export async function getSession(req: Request, res: Response) {
  if (isResponseLocalsAuthSession(res)) {
    return res.locals['session'];
  }

  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (session === null) {
    return null;
  }

  return session;
}
