import { environment } from '@lib/environment';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { SignUpClientPage } from './_page';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default async function SignUpPage() {
  await connection();
  if (environment.AUTH_METHOD === 'none') {
    throw new Error('Authentication is not enabled');
  }

  return <SignUpClientPage />;
}
