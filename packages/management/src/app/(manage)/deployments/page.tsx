'use client';

import { useApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disableSsr';

function DeploymentsPage() {
  const { data, isLoading } = useApi('/collections/deployments');

  return <div>Deployments {JSON.stringify(data)}</div>;
}

export default disableSSR(DeploymentsPage);
