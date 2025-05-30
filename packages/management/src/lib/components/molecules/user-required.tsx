'use server';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { useUserIsRequired } from '@lib/auth/hooks/use-user-is-required';
import 'server-only';

export async function UserRequired({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const userIsRequired = useUserIsRequired();
  if ((await getAuthMethod()) !== 'none') {
    await userIsRequired();
  }

  return children;
}
