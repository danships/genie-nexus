'use server';

import { environment } from '@lib/environment';
import { redirect } from 'next/navigation';
import { getServerSession } from './get-server-session';

export async function ensureUserIsAuthenticated() {
  if (environment.AUTH_METHOD === 'none') {
    return;
  }

  const session = await getServerSession();
  if (session === null) {
    redirect('/login');
  }
}
