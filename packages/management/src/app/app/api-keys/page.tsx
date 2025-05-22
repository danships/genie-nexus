import { ApiKeysClientPage } from './_page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Keys',
};

export default function ApiKeysPage() {
  return <ApiKeysClientPage />;
}
