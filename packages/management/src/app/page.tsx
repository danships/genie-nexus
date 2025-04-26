import { Container, Title, Text } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="lg">
        Welcome to Genie Nexus
      </Title>
      <Text size="lg" ta="center" c="dimmed">
        Your AI-powered management interface
      </Text>
    </Container>
  );
}
