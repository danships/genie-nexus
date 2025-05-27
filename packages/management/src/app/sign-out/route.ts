import { getNextAuth } from '@lib/auth/next-auth';
import { redirect } from 'next/navigation';

export const GET = async function () {
  const auth = await getNextAuth();
  await auth.signOut();
  redirect('/');
};
