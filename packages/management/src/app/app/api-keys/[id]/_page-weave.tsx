'use client';

import type {
  DeploymentWeaveApi,
  WeaveApiKey,
  WeaveApiKeyApi,
} from '@genie-nexus/types';
import { ENDPOINT_APIKEYS_OVERVIEW } from '@lib/api/swr-constants';
import { useCudApi } from '@lib/api/use-api';
import { PageTitle } from '@lib/components/atoms/page-title';
import { ApiKeyToggle } from '@lib/components/molecules/api-key-toggle';
import { DeploymentsList } from '@lib/components/molecules/deployments-list';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

type Properties = {
  apiKey: WeaveApiKeyApi;
  deployments: DeploymentWeaveApi[];
};

export function ApiKeyWeaveDetailClientPage({
  apiKey: initialApiKey,
  deployments,
}: Properties) {
  const { patch: patchActive, inProgress: inProgressActive } = useCudApi();
  const { patch, inProgress } = useCudApi();
  const { mutate } = useSWRConfig();
  const [apiKey, setApiKey] = useState<WeaveApiKeyApi>(initialApiKey);

  const handleToggleActive = async (newActive: boolean) => {
    const response = await patchActive<
      { data: WeaveApiKey },
      { active: boolean }
    >(`/collections/apikeys/${apiKey.id}`, { active: newActive });
    if (response?.data) {
      void mutate(ENDPOINT_APIKEYS_OVERVIEW);
      notifications.show({
        title: 'Success',
        message: `API key ${newActive ? 'enabled' : 'disabled'} successfully`,
        color: 'green',
      });
      setApiKey((previous) => ({
        ...previous,
        active: newActive,
      }));
    }
  };

  const handleDeploymentsChange = async (newDeployments: string[]) => {
    const response = await patch<
      { data: WeaveApiKey },
      { allowedDeployments: string[] }
    >(`/collections/apikeys/${apiKey.id}`, {
      allowedDeployments: newDeployments,
    });
    if (response?.data) {
      void mutate(ENDPOINT_APIKEYS_OVERVIEW);
      notifications.show({
        title: 'Success',
        message: 'API key updated successfully',
        color: 'green',
      });
      setApiKey((previous) => ({
        ...previous,
        allowedDeployments: newDeployments,
      }));
    }
  };

  return (
    <>
      <PageTitle>Weave API Key: {apiKey.label}</PageTitle>

      <ApiKeyToggle
        apiKey={apiKey}
        onToggle={handleToggleActive}
        inProgress={inProgressActive}
      />

      <DeploymentsList
        deployments={deployments}
        allowedDeployments={apiKey.allowedDeployments || []}
        onDeploymentsChange={handleDeploymentsChange}
        inProgress={inProgress}
      />
    </>
  );
}
