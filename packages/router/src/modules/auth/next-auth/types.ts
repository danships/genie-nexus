import type { DefaultSession, Session } from '@auth/express';
import type { NextAuthUser } from '@genie-nexus/database';
import type { Response } from 'express';

declare module '@auth/express' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: NextAuthUser & DefaultSession['user'];
  }

  interface User extends NextAuthUser {}
}

export type ResponseLocalsNextAuthSession = {
  session: Session;
};

export function isResponseLocalsNextAuthSession(
  // biome-ignore lint/suspicious/noExplicitAny: In this typecheck any is allowed.
  res: Response<unknown, any>
): res is Response<unknown, ResponseLocalsNextAuthSession> {
  return (
    res.locals &&
    typeof res.locals === 'object' &&
    'session' in res.locals &&
    typeof res.locals['session'] === 'object' &&
    res.locals['session'] !== null
  );
}
