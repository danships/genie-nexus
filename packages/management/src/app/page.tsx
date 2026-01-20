import { auth } from '@lib/auth/auth';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HomePageClient } from './_page';

export default async function HomePage() {
  if ((await getAuthMethod()) === 'none') {
    redirect('/app');
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const authorized = !!session?.user;

  if (authorized) {
    redirect('/app');
  }

  return <HomePageClient />;
}
