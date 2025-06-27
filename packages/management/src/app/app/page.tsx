import { UserRequired } from '@lib/components/molecules/user-required';
import { DashboardClientPage } from './_page';

export default function AppPage() {
  return (
    <UserRequired>
      <DashboardClientPage />
    </UserRequired>
  );
}
