import { NewApiKeyPage } from './_page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create API Key',
};

export default function Page() {
  return <NewApiKeyPage />;
}
