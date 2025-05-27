import { type Session, getSession as getSessionAuth } from '@auth/express';
import { getNextAuthUserRepository } from '@genie-nexus/database';
import type { Request, Response } from 'express';
import { logger } from '../../../core/logger.js';
import { getNextAuthConfig } from './get-next-auth-config.js';
import { isResponseLocalsNextAuthSession } from './types.js';

export async function getSession(
  req: Request,
  res: Response
): Promise<Session | null> {
  if (isResponseLocalsNextAuthSession(res)) {
    return res.locals['session'];
  }

  const session = await getSessionAuth(req, await getNextAuthConfig());
  if (session === null) {
    return null;
  }

  res.locals['session'] = session;

  // TODO: when testing, the user set was only { email: 'xxx' }, so we replace it with the full object for now
  const userRepository = await getNextAuthUserRepository();
  const user = await userRepository.getOneByQuery(
    userRepository.createQuery().eq('email', session.user.email)
  );
  if (user) {
    // @ts-expect-error TODO, cannot align the zod generated DB type for the name attribute (undefined/null)
    session.user = user;
  } else {
    logger.warn('User not found', { email: session.user.email });
    return null;
  }
  return session;
}
