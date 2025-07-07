import Credentials from '@auth/express/providers/credentials';
import { getNextAuthUserRepository } from '@genie-nexus/database';
import { getCredentialsAuthorize } from './credentials.js';

export async function createCredentialsProvider() {
  const userRepository = await getNextAuthUserRepository();
  return Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    // @ts-expect-error TODO, cannot align the zod generated DB type for the name attribute (undefined/null)
    authorize: getCredentialsAuthorize(userRepository),
  });
}
