'use client';

import { PageTitle } from '@lib/components/atoms/page-title';
import {
  Card,
  type MantineColorScheme,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';

export function SettingsClientPage() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as MantineColorScheme);
    localStorage.setItem('mantine-color-scheme', value);
  };

  return (
    <>
      <PageTitle>Settings</PageTitle>
      <Card withBorder shadow="sm" radius="md" p="xl">
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
    </>
  );
}
