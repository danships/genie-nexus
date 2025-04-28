import Credentials from '@auth/express/providers/credentials';
import { getCredentialsAuthorize } from '@genie-nexus/auth';
import { getNextAuthUserRepository } from '@genie-nexus/database';

export async function getCredentialsProvider() {
  const userRepository = await getNextAuthUserRepository();
  return Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: getCredentialsAuthorize(userRepository),
  });
}
