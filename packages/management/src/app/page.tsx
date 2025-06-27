import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getNextAuth } from '@lib/auth/next-auth';
import { redirect } from 'next/navigation';
import { HomePageClient } from './_page';

export default async function HomePage() {
  if ((await getAuthMethod()) === 'none') {
    redirect('/app');
  }

  const { auth } = await getNextAuth();
  const session = await auth();
  const authorized = !!session?.user;

  if (authorized) {
    redirect('/app');
  }

  return <HomePageClient />;
}
