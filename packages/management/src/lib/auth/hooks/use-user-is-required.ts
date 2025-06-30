import { getNextAuth } from '../next-auth';
import 'server-only';
import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import { getContainer } from '@lib/core/get-container';

export function useUserIsRequired() {
  return async function () {
    const { auth, signIn } = await getNextAuth();
    const session = await auth();

    if (!session?.user?.email) {
      const logger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);

      logger.error('No user details set in session.');
      await signIn();
      return;
    }
  };
}
