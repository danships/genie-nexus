import {
  ScrollAreaAutosize,
  Stack,
  Text,
  UnstyledButton,
  ActionIcon,
  Group,
} from '@mantine/core';
import Link from 'next/link';
import { useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useCallback } from 'react';

export const Navbar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const changeColorScheme = useCallback(() => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mantine-color-scheme', newColorScheme);
    toggleColorScheme();
  }, [colorScheme, toggleColorScheme]);

  return (
    <Stack h="100%" justify="space-between">
      <ScrollAreaAutosize>
        <Stack>
          <UnstyledButton component={Link} href="/app/deployments">
            <Text fw={500}>Deployments</Text>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/providers">
            <Text fw={500}>Providers</Text>
          </UnstyledButton>
          <UnstyledButton component={Link} href="/app/api-keys">
            <Text fw={500}>API Keys</Text>
          </UnstyledButton>
        </Stack>
      </ScrollAreaAutosize>
      <Group justify="center" p="md">
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
      </Group>
    </Stack>
  );
};
