import { auth } from '@lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const GET = async function () {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');
};
