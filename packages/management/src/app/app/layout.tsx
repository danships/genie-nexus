import { getAuthMethod } from '@lib/auth/get-auth-method';
import AppLayoutClient from './_layout-client';
import { UserRequired } from '@lib/components/molecules/user-required';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authMethod = await getAuthMethod();
  return (
    <UserRequired>
      <AppLayoutClient authMethod={authMethod}>{children}</AppLayoutClient>
    </UserRequired>
  );
}
