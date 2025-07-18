import { TypeSymbols, inject, singleton } from '@genie-nexus/container';
import type { NextAuthUserRepository } from '@genie-nexus/database';
import type { NextAuthConfig } from 'next-auth';
import { COOKIE_NAME } from '../constants.js';
import { createCredentialsProvider } from '../create-credentials-provider.js';
import { GetConfiguration } from '../get-configuration.js';

@singleton()
export class GetNextConfiguration {
  private configuration: NextAuthConfig | null = null;
  constructor(
    @inject(TypeSymbols.NEXT_AUTH_USER_REPOSITORY)
    private readonly nextAuthUserRepository: NextAuthUserRepository,
    @inject(GetConfiguration)
    private readonly getConfiguration: GetConfiguration
  ) {}

  public async createConfig(
    authMethod: 'credentials' | 'none'
  ): Promise<NextAuthConfig> {
    if (this.configuration !== null) {
      return this.configuration;
    }

    const { secret } = await this.getConfiguration.getConfiguration();

    this.configuration = {
      secret,
      trustHost: true,
      cookies: {
        sessionToken: {
          name: COOKIE_NAME,
        },
      },
      providers:
        authMethod === 'credentials' ? [await createCredentialsProvider()] : [],
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

          // @ts-expect-error, user is returned by credentials provider, so we know it's our own db object
          await this.nextAuthUserRepository.update({
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
    return this.configuration;
  }
}
