import type { AuthMethod } from '@lib/auth/types';
import { useVersionCheck } from '@lib/hooks/use-version-check';
import {
  ActionIcon,
  Avatar,
  Group,
  ScrollAreaAutosize,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import {
  IconChartBar,
  IconDashboard,
  IconDownload,
  IconKey,
  IconMoon,
  IconRocket,
  IconServer,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useCallback } from 'react';

export const Navbar = ({ authMethod }: { authMethod: AuthMethod }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { showUpdateIndicator } = useVersionCheck();

  const changeColorScheme = useCallback(() => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mantine-color-scheme', newColorScheme);
    toggleColorScheme();
  }, [colorScheme, toggleColorScheme]);

  return (
    <Stack h="100%" justify="space-between">
      <ScrollAreaAutosize>
        <Stack>
          <UnstyledButton component={Link} href="/app">
            <Group gap="sm">
              <IconDashboard size={18} />
              <Text fw={500}>Dashboard</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/deployments">
            <Group gap="sm">
              <IconRocket size={18} />
              <Text fw={500}>Deployments</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/providers">
            <Group gap="sm">
              <IconServer size={18} />
              <Text fw={500}>Providers</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/insights">
            <Group gap="sm">
              <IconChartBar size={18} />
              <Text fw={500}>Insights</Text>
            </Group>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/api-keys">
            <Group gap="sm">
              <IconKey size={18} />
              <Text fw={500}>API Keys</Text>
            </Group>
          </UnstyledButton>
        </Stack>
      </ScrollAreaAutosize>

      <Group justify="center" p="md">
        {showUpdateIndicator && (
          <ActionIcon
            variant="default"
            component={Link}
            href="/app/updates"
            size="lg"
            aria-label="There are updates available"
            title="There are updates available"
          >
            <IconDownload size={18} />
          </ActionIcon>
        )}
        {authMethod === 'none' && (
          <ActionIcon
            variant="default"
            onClick={changeColorScheme}
            size="lg"
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )}
          </ActionIcon>
        )}
        {authMethod === 'credentials' && (
          <>
            <Link href="/app/user">
              <Avatar td="none" />
            </Link>
            <ActionIcon
              variant="default"
              size="lg"
              component={Link}
              href="/app/settings"
            >
              <IconSettings />
            </ActionIcon>
          </>
        )}
      </Group>
    </Stack>
  );
};
