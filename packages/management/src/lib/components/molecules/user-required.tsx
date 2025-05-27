import { getAuthMethod } from '@lib/auth/get-auth-method';
import { useUserIsRequired } from '@lib/auth/hooks/use-user-is-required';
import 'server-only';

export async function UserRequired({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await getAuthMethod()) !== 'none') {
    await useUserIsRequired();
  }

  return children;
}
