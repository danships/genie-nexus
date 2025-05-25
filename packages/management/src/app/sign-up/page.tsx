import { environment } from '@lib/environment';
import { SignUpClientPage } from './_page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  if (environment.AUTH_METHOD === 'none') {
    throw new Error('Authentication is not enabled');
  }

  return <SignUpClientPage />;
}
