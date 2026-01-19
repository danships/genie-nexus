import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '../auth';
import 'server-only';
import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import { getContainer } from '@lib/core/get-container';

export function useUserIsRequired() {
  return async function () {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      const logger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);

      logger.error('No user details set in session.');
      redirect('/sign-in');
    }
  };
}
