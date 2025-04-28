'use client';

import { useApi } from '@lib/api/use-api';
import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { Loader } from '@lib/components/atoms/loader';

function DeploymentsPage() {
  const { data, isLoading } = useApi('/collections/deployments');

  return (
    <>
      {isLoading && <Loader />}
      {JSON.stringify(data)}
    </>
  );
}

export default disableSSR(DeploymentsPage);
