import { UserRequired } from '@lib/components/molecules/user-required';
import { DeploymentsClientPage } from './_page';

export const metadata = {
  title: 'Deployments',
};

export default function DeploymentsPage() {
  return (
    <UserRequired>
      <DeploymentsClientPage />
    </UserRequired>
  );
}
