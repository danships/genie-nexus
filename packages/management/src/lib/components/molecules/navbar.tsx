import { Stack, Text, UnstyledButton } from '@mantine/core';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <Stack>
      <UnstyledButton component={Link} href="/app/deployments">
        <Text fw={500}>Deployments</Text>
      </UnstyledButton>
      <UnstyledButton component={Link} href="/app/providers">
        <Text fw={500}>Providers</Text>
      </UnstyledButton>
    </Stack>
  );
};
