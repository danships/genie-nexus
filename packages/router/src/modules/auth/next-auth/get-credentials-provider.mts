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
    // @ts-expect-error TODO, cannot align the zod generated DB type for the name attribute (undefined/null)
    authorize: getCredentialsAuthorize(userRepository),
  });
}
