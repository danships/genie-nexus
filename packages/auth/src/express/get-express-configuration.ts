import type { ExpressAuthConfig } from '@auth/express';
import { TypeSymbols, inject, singleton } from '@genie-nexus/container';
import type { NextAuthUserRepository } from '@genie-nexus/database';
import { COOKIE_NAME } from '../constants.js';
import { createCredentialsProvider } from '../create-credentials-provider.js';
import { GetConfiguration } from '../get-configuration.js';

@singleton()
export class GetExpressConfiguration {
  private configuration: ExpressAuthConfig | null = null;

  constructor(
    @inject(GetConfiguration)
    private readonly getConfiguration: GetConfiguration,
    @inject(TypeSymbols.NEXT_AUTH_USER_REPOSITORY)
    private readonly nextAuthUserRepository: NextAuthUserRepository
  ) {}

  public async getExpressConfiguration(): Promise<ExpressAuthConfig> {
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
      providers: [await createCredentialsProvider()],
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
    };

    return this.configuration;
  }
}
