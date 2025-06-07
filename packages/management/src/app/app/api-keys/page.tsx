import { UserRequired } from '@lib/components/molecules/user-required';
import type { Metadata } from 'next';
import { ApiKeysClientPage } from './_page';

export const metadata: Metadata = {
  title: 'API Keys',
};

export default function ApiKeysPage() {
  return (
    <UserRequired>
      <ApiKeysClientPage />
    </UserRequired>
  );
}
