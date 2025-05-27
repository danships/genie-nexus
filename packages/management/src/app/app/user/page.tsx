import { getNextAuth } from '@lib/auth/next-auth';
import type { Metadata } from 'next';
import { UserClientPage } from './_page';
import { UserRequired } from '@lib/components/molecules/user-required';

export const metadata: Metadata = {
  title: 'User Details',
};

export default async function UserPage() {
  const { auth } = await getNextAuth();
  const session = await auth();

  return (
    <UserRequired>
      {session && <UserClientPage session={session} />}
    </UserRequired>
  );
}
