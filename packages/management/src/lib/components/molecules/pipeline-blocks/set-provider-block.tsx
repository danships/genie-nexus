import type { ProviderApi, SetProviderAction } from '@genie-nexus/types';
import { ENDPOINT_PROVIDERS_OVERVIEW } from '@lib/api/swr-constants';
import { useApi } from '@lib/api/use-api';
import { Loader } from '@lib/components/atoms/loader';
import { Paper, Select, Stack, Text } from '@mantine/core';

type Properties = {
  action: SetProviderAction;
  onChange: (action: SetProviderAction) => void;
};

export function SetProviderBlock({ action, onChange }: Properties) {
  const { data: providers, isLoading } = useApi<ProviderApi[]>(
    `${ENDPOINT_PROVIDERS_OVERVIEW}&type[in]=http-proxy,http-static`
  );

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Text fw={500}>Set Provider</Text>
        {isLoading && <Loader />}
        {providers && (
          <Select
            label="Provider"
            value={action.providerId}
            onChange={(value) =>
              value && onChange({ ...action, providerId: value })
            }
            data={providers.map((provider) => ({
              value: provider.id,
              label: `${provider.name} (${provider.type})`,
            }))}
            placeholder="Select a provider"
          />
        )}
      </Stack>
    </Paper>
  );
}
