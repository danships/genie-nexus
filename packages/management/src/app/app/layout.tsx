import { getAuthMethod } from '@lib/auth/get-auth-method';
import { UserRequired } from '@lib/components/molecules/user-required';
import AppLayoutClient from './_layout-client';

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
