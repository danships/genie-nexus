import { PageTitle } from '@lib/components/atoms/page-title';
import { Button, Container, Text } from '@mantine/core';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <Container>
      <PageTitle>Welcome to Genie Nexus!</PageTitle>
      <Text mb="md">
        Your Genie Nexus instance will be protected with at least one account.
        After that account has been created you can choose to disable
        self-registration for new accounts.
      </Text>
      <Button
        component={Link}
        href="/sign-up"
        data-umami-event="onboarding-create-account"
      >
        Create account
      </Button>
    </Container>
  );
}
