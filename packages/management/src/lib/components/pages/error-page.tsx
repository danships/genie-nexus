import { Container, Paper } from '@mantine/core';
import { ErrorNotification } from '../atoms/error-notification';
import { PageTitle } from '../atoms/page-title';

export function ErrorPage({
  title = 'Error',
  message = 'An error occurred',
}: { title?: string; message?: string }) {
  return (
    <Container>
      <PageTitle>{title}</PageTitle>
      <Paper withBorder shadow="sm" radius="md" p="xl">
        <ErrorNotification>{message}</ErrorNotification>
      </Paper>
    </Container>
  );
}
