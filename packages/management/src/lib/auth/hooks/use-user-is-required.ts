import { serverLogger } from '@lib/core/server-logger';
import { getNextAuth } from '../next-auth';
import 'server-only';

export function useUserIsRequired() {
  return async function () {
    const { auth, signIn } = await getNextAuth();
    const session = await auth();

    if (!session?.user?.email) {
      serverLogger.error('No user details set in session.');
      await signIn();
      return;
    }
  };
}
