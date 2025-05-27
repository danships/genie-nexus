import { UserRequired } from '@lib/components/molecules/user-required';
import { ApiKeysClientPage } from './_page';
import { Metadata } from 'next';

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
