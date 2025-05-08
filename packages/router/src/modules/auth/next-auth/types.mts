import type { Session, DefaultSession } from '@auth/express';
import type { NextAuthUser } from '@genie-nexus/database';
import type { Response } from 'express';

declare module '@auth/express' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: NextAuthUser & DefaultSession['user'];
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends NextAuthUser {}
}

export type ResponseLocalsNextAuthSession = {
  session: Session;
};

export function isResponseLocalsNextAuthSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: Response<unknown, any>,
): res is Response<unknown, ResponseLocalsNextAuthSession> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    res.locals &&
    typeof res.locals === 'object' &&
    'session' in res.locals &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof res.locals['session'] === 'object' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.locals['session'] !== null
  );
}
