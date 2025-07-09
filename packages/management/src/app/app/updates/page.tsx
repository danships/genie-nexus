import { UserRequired } from '@lib/components/molecules/user-required';
import { UpdatesClientPage } from './_page';

export const metadata = {
  title: 'Updates',
};

export default function UpdatesPage() {
  return (
    <UserRequired>
      <UpdatesClientPage />
    </UserRequired>
  );
}
