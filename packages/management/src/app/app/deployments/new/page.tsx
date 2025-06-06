import { UserRequired } from '@lib/components/molecules/user-required';
import { NewDeploymentPage } from './_page';

export const metadata = {
  title: 'Create a New Deployment',
};

export default function DeploymentsPage() {
  return (
    <UserRequired>
      <NewDeploymentPage />
    </UserRequired>
  );
}
