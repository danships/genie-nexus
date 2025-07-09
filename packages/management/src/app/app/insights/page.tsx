import { UserRequired } from '@lib/components/molecules/user-required';
import { InsightsClientPage } from './_page';

export default function InsightsPage() {
  return (
    <UserRequired>
      <InsightsClientPage />
    </UserRequired>
  );
}
