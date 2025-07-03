'use client';

import type { ServerConfiguration } from '@genie-nexus/types';
import { useCudApi } from '@lib/api/use-api';
import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Button,
  Card,
  Group,
  type MantineColorScheme,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

type Properties = {
  serverConfiguration: ServerConfiguration;
  showRegistration: boolean;
};

export function SettingsClientPage({
  serverConfiguration,
  showRegistration,
}: Properties) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { post, inProgress } = useCudApi();

  const form = useForm<ServerConfiguration>({
    initialValues: serverConfiguration,
  });

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as MantineColorScheme);
    localStorage.setItem('mantine-color-scheme', value);
  };

  const handleServerConfigurationChange = async (
    values: ServerConfiguration
  ) => {
    const changedValues: Partial<ServerConfiguration> = {};

    if (values.telemetryEnabled !== serverConfiguration.telemetryEnabled) {
      changedValues.telemetryEnabled = values.telemetryEnabled;
    }

    if (
      showRegistration &&
      values.registrationEnabled !== serverConfiguration.registrationEnabled
    ) {
      changedValues.registrationEnabled = values.registrationEnabled;
    }

    if (Object.keys(changedValues).length === 0) {
      notifications.show({
        title: 'No Changes',
        message: 'No configuration changes detected',
        color: 'blue',
      });
      return;
    }

    try {
      await post('/configuration/server', changedValues);
      notifications.show({
        title: 'Success',
        message: 'Server configuration updated successfully',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update server configuration',
        color: 'red',
      });
    }
  };

  return (
    <>
      <PageTitle>Settings</PageTitle>

      <Card withBorder shadow="sm" radius="md" mb="md" p="xl">
        <Stack gap="md">
          <Title order={3}>Theme Preferences</Title>
          <Text c="dimmed">
            Choose your preferred color scheme for the application.
          </Text>
          <SegmentedControl
            value={colorScheme}
            onChange={handleColorSchemeChange}
            data={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'auto' },
            ]}
            fullWidth
          />
        </Stack>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="xl" mb="md">
        <Stack gap="md">
          <Title order={3}>Server Configuration</Title>
          <Text c="dimmed">
            Configure server-wide settings for telemetry and user registration.
          </Text>

          <form onSubmit={form.onSubmit(handleServerConfigurationChange)}>
            {showRegistration && (
              <Switch
                label="Enable Registration"
                description="Allow new users to create accounts"
                {...form.getInputProps('registrationEnabled', {
                  type: 'checkbox',
                })}
              />
            )}
            <Switch
              label="Enable Telemetry"
              description="Allow the server to collect usage analytics and performance data"
              {...form.getInputProps('telemetryEnabled', { type: 'checkbox' })}
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                loading={inProgress}
                data-umami-event="settings-save-changes"
              >
                Save Changes
              </Button>
            </Group>
          </form>
        </Stack>
      </Card>
    </>
  );
}
