import { UserRequired } from '@lib/components/molecules/user-required';
import { Metadata } from 'next';
import { NewApiKeyPage } from './_page';

export const metadata: Metadata = {
  title: 'Create API Key',
};

export default function Page() {
  return (
    <UserRequired>
      <NewApiKeyPage />
    </UserRequired>
  );
}
