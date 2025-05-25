import type { Session } from 'better-auth';
import type { Response } from 'express';

export type ResponseLocalsAuthSession = {
  session: Session;
};

export function isResponseLocalsAuthSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: Response<unknown, any>,
): res is Response<unknown, ResponseLocalsAuthSession> {
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
