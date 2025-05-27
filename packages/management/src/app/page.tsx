import { Button, Container, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="lg">
        Welcome to Genie Nexus
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        Your AI-powered management interface
      </Text>
      <Button component={Link} href="/app">
        Manage
      </Button>
    </Container>
  );
}
