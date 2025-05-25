'use server';

import { getAuth } from '@genie-nexus/auth';
import type { Session } from 'better-auth';
import { headers } from 'next/headers';

export async function getServerSession(): Promise<Session | null> {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  return session;
}
