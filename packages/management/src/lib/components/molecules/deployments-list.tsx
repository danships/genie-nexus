'use client';

import { DeploymentLLMApi, DeploymentWeaveApi } from '@genie-nexus/types';
import { DetailCard } from '@lib/components/molecules/detail-card';
import { debugLogger } from '@lib/core/debug-logger';
import { Button, Checkbox, Notification, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck } from '@tabler/icons-react';

type Properties = {
  deployments: (DeploymentWeaveApi | DeploymentLLMApi)[];
  allowedDeployments: string[];
  onDeploymentsChange: (deployments: string[]) => void;
  inProgress: boolean;
};

export function DeploymentsList({
  deployments,
  allowedDeployments,
  onDeploymentsChange,
  inProgress,
}: Properties) {
  const form = useForm<{ allowedDeployments: string[] }>({
    initialValues: {
      allowedDeployments: allowedDeployments || [],
    },
  });

  const handleSubmit = (values: { allowedDeployments: string[] }) => {
    try {
      onDeploymentsChange(values.allowedDeployments);
    } catch (error) {
      debugLogger('Failed to update API key:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update API key',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <DetailCard
        icon={IconCircleCheck}
        title="Select which deployments this API key can access:"
      >
        <Notification
          mb="md"
          color="yellow"
          withCloseButton={false}
          title={
            (form.values.allowedDeployments ?? []).length === 0
              ? 'No deployments are selected. This API Key can be used to access all active deployments.'
              : 'Only the selected deployments can be accessed with this API key.'
          }
        />

        <Stack gap="xs">
          {deployments.map((deployment) => (
            <Checkbox
              key={deployment.id}
              label={deployment.name}
              checked={form.values.allowedDeployments.includes(deployment.id)}
              onChange={(event) => {
                const newValue = event.currentTarget.checked
                  ? [...form.values.allowedDeployments, deployment.id]
                  : form.values.allowedDeployments.filter(
                      (id: string) => id !== deployment.id
                    );
                form.setFieldValue('allowedDeployments', newValue);
              }}
            />
          ))}
        </Stack>

        <Button type="submit" loading={inProgress} mt="md">
          Save Changes
        </Button>
      </DetailCard>
    </form>
  );
}
