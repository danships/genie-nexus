import type { NextAuthUser } from '@genie-nexus/database';
import type { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth';
import 'server-only';
import { GetNextConfiguration } from '@genie-nexus/auth/nextjs';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<NextAuthUser, 'password'> & DefaultSession['user'];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends NextAuthUser {}
}

let nextAuth: ReturnType<typeof NextAuth> | undefined;

export async function getNextAuth() {
  if (!nextAuth) {
    const container = await getContainer();

    const getNextConfiguration =
      container.resolve<GetNextConfiguration>(GetNextConfiguration);

    const configuration = await getNextConfiguration.createConfig(
      environment.AUTH_METHOD
    );

    nextAuth = NextAuth(configuration);
  }
  return nextAuth;
}
