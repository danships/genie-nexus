'use client';

import { disableSSR } from '@lib/components/atoms/disable-ssr';
import { PageTitle } from '@lib/components/atoms/page-title';
import { useVersionCheck } from '@lib/hooks/use-version-check';
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconExternalLink,
  IconEye,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { format } from 'date-fns';

export const UpdatesClientPage = disableSSR(function () {
  const { dismissUpdate, versionInfo, loading, error } = useVersionCheck();

  const isLatestReleaseDismissed = () => {
    if (!versionInfo?.hasUpdates || !versionInfo.latestRelease) {
      return false;
    }
    const currentVersion = versionInfo.currentVersion;
    const latestVersion = versionInfo.latestRelease.tag_name.replace('v', '');
    const dismissedKey = `genie-nexus-update-dismissed-${currentVersion}-${latestVersion}`;
    return localStorage.getItem(dismissedKey) === 'true';
  };

  const handleDismissUpdate = () => {
    dismissUpdate();
    notifications.show({
      title: 'Update Ignored',
      message: `Version ${versionInfo?.latestRelease?.tag_name} has been ignored. You will no longer see update notifications for this version.`,
      color: 'blue',
      icon: <IconX size={16} />,
    });
  };

  if (loading) {
    return (
      <Stack>
        <PageTitle>Updates</PageTitle>
        <Card withBorder shadow="sm" radius="md" p="xl">
          <Text>Checking for updates...</Text>
        </Card>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack>
        <PageTitle>Updates</PageTitle>
        <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Stack>
    );
  }

  if (!versionInfo) {
    return (
      <Stack>
        <PageTitle>Updates</PageTitle>
        <Card withBorder shadow="sm" radius="md" p="xl">
          <Text>Unable to load update information.</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack>
      <PageTitle>Updates</PageTitle>

      <Card withBorder shadow="sm" radius="md" p="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Title order={3}>Current Version</Title>
              <Text size="lg" fw={500}>
                v{versionInfo.currentVersion}
              </Text>
            </Stack>
            <Badge
              size="lg"
              color={versionInfo.hasUpdates ? 'green' : 'gray'}
              variant="light"
            >
              {versionInfo.hasUpdates ? 'Update Available' : 'Up to Date'}
            </Badge>
          </Group>

          {versionInfo.hasUpdates && versionInfo.latestRelease && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="Latest Release Available"
              color="green"
            >
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Stack gap="xs">
                    <Text fw={500} size="lg">
                      {versionInfo.latestRelease.name ||
                        versionInfo.latestRelease.tag_name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Released on{' '}
                      {format(
                        new Date(versionInfo.latestRelease.published_at),
                        'PPP'
                      )}
                    </Text>
                  </Stack>
                  <Group gap="xs">
                    <Button
                      component="a"
                      href={versionInfo.latestRelease.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      leftSection={<IconEye size={16} />}
                      data-umami-event="updates-download-latest"
                    >
                      View Details
                    </Button>
                    {!isLatestReleaseDismissed() && (
                      <Button
                        variant="light"
                        color="gray"
                        leftSection={<IconX size={16} />}
                        onClick={handleDismissUpdate}
                        data-umami-event="updates-ignore-release"
                      >
                        Ignore this version
                      </Button>
                    )}
                  </Group>
                </Group>
                {versionInfo.latestRelease.body && (
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {versionInfo.latestRelease.body}
                  </Text>
                )}
              </Stack>
            </Alert>
          )}

          {versionInfo.newerReleases.length > 1 && (
            <Stack gap="md">
              <Title order={4}>All Available Updates</Title>
              {versionInfo.newerReleases.map((release) => (
                <Card
                  key={release.id}
                  withBorder
                  shadow="xs"
                  radius="md"
                  p="md"
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text fw={500}>{release.name || release.tag_name}</Text>

                      <Text size="sm" c="dimmed">
                        {format(new Date(release.published_at), 'PPP')}
                      </Text>
                      {release.body && (
                        <Text size="sm" lineClamp={3}>
                          {release.body}
                        </Text>
                      )}
                    </Stack>
                    <Button
                      component="a"
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      size="sm"
                      leftSection={<IconExternalLink size={14} />}
                      data-umami-event="updates-view-release"
                    >
                      View
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}

          {!versionInfo.hasUpdates && (
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="No Updates Available"
              color="blue"
            >
              You are running the latest version of Genie Nexus.
            </Alert>
          )}
        </Stack>
      </Card>
    </Stack>
  );
});
