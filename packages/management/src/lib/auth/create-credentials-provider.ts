import Credentials from 'next-auth/providers/credentials';
import { getCredentialsAuthorize } from '@genie-nexus/auth';
import { getNextAuthUserRepository } from '@genie-nexus/database';

export const createCredentialsProvider = async () => {
  const userRepository = await getNextAuthUserRepository();
  return Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    // @ts-expect-error - TODO: fix this, the Zod inferred typings do not match the expected User type for name
    authorize: getCredentialsAuthorize(userRepository),
  });
};
