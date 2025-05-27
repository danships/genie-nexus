import { UserRequired } from '@lib/components/molecules/user-required';
import { SettingsClientPage } from './_page';

export const metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <UserRequired>
      <SettingsClientPage />
    </UserRequired>
  );
}
