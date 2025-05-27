import { Metadata } from 'next';
import { LoginClientPage } from './_page';
import { getAuthMethod } from '@lib/auth/get-auth-method';

export const metadata: Metadata = {
  title: 'Login',
};

type Properties = {
  searchParams: Promise<Record<string, string>>;
};

export default async function LoginPage({ searchParams }: Properties) {
  if ((await getAuthMethod()) !== 'credentials') {
    throw new Error('Credentials auth is required');
  }

  // read query params ?error=CredentialsSignin&code=credentials
  const { error, code } = await searchParams;

  const errorMessage =
    error === 'CredentialsSignin' && code === 'credentials'
      ? 'Invalid credentials'
      : '';

  return <LoginClientPage error={errorMessage} />;
}
