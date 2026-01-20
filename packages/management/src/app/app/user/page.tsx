import { auth } from '@lib/auth/auth';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'User Details',
};

export default async function UserPage() {
  if ((await getAuthMethod()) === 'none') {
    return null;
  }

  const { UserRequired } = await import(
    '@lib/components/molecules/user-required'
  );
  const { UserClientPage } = await import('./_page');

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <UserRequired>
      {session && <UserClientPage session={session} />}
    </UserRequired>
  );
}
