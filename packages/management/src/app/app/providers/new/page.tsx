import { Metadata } from 'next';
import NewProviderClientPage from './_page';

export const metadata: Metadata = {
  title: 'Create a new Provider',
};

export default function NewProviderPage() {
  return <NewProviderClientPage />;
}
