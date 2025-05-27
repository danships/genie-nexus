import { COOKIE_NAME } from '@genie-nexus/auth';
import { type NextAuthUser } from '@genie-nexus/database';
import { initialize } from '@genie-nexus/database';
import { getNextAuthUserRepository } from '@lib/core/db';
import { environment } from '@lib/environment';
import type { DefaultSession, NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { createCredentialsProvider } from './create-credentials-provider';
import 'server-only';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<NextAuthUser, 'password'> & DefaultSession['user'];
  }

  interface User extends NextAuthUser {}
}

async function createConfig(): Promise<NextAuthConfig> {
  return {
    cookies: {
      sessionToken: {
        name: COOKIE_NAME,
      },
    },
    providers:
      environment.AUTH_METHOD === 'next-auth'
        ? [await createCredentialsProvider()]
        : [],
    callbacks: {
      jwt: ({ token, account }) => {
        if (account) {
          // Add the user id to the token right after the user signs in
          token['id'] = account.providerAccountId;
        }
        return token;
      },
    },
    events: {
      signIn: async ({ user }) => {
        if (user === null) {
          return;
        }

        const userRepository = await getNextAuthUserRepository();
        // @ts-expect-error, user is returned by credentials provider, so we know it's our own db object
        await userRepository.update({
          ...user,
          lastLogin: new Date().toISOString(),
        });
      },
    },
    pages: {
      newUser: '/sign-up',
      signIn: '/sign-in',
    },
  };
}

let nextAuth: ReturnType<typeof NextAuth> | undefined;

export async function getNextAuth() {
  if (!nextAuth) {
    // initialize the database
    await initialize({
      connectionString: environment.DB,
      executeMigrations: false, // the router takes care of those
    });
    nextAuth = NextAuth(await createConfig());
  }
  return nextAuth;
}
