import { getAuthMethod } from '@lib/auth/get-auth-method';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Details',
};

export default async function UserPage() {
  if ((await getAuthMethod()) === 'none') {
    return null;
  }

  const { getNextAuth } = await import('@lib/auth/next-auth');
  const { UserRequired } = await import(
    '@lib/components/molecules/user-required'
  );
  const { UserClientPage } = await import('./_page');

  const { auth } = await getNextAuth();
  const session = await auth();

  return (
    <UserRequired>
      {session && <UserClientPage session={session} />}
    </UserRequired>
  );
}
