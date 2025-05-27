import { type ExpressAuthConfig } from '@auth/express';
import { COOKIE_NAME } from '@genie-nexus/auth';
import { getNextAuthUserRepository } from '@genie-nexus/database';
import { getCredentialsProvider } from './get-credentials-provider.js';

let nextAuthConfig: ExpressAuthConfig;

export async function getNextAuthConfig() {
  if (!nextAuthConfig) {
    // TODO: move this (the default config) to the auth package
    nextAuthConfig = {
      cookies: {
        sessionToken: {
          name: COOKIE_NAME,
        },
      },
      providers: [await getCredentialsProvider()],
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
    };
  }
  return nextAuthConfig;
}
