'use client';

import type { auth } from '@lib/auth/auth';
import { PageTitle } from '@lib/components/atoms/page-title';
import { DetailCard } from '@lib/components/molecules/detail-card';
import { Button, Stack } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import Link from 'next/link';

export function UserClientPage({
  session,
}: { session: typeof auth.$Infer.Session }) {
  return (
    <>
      <PageTitle>User Details</PageTitle>
      <Stack mt="md" className="is-half-size">
        {session?.user.email && (
          <DetailCard title="Name" icon={IconUser}>
            {session?.user.name} ({session?.user.email})
          </DetailCard>
        )}
        <Button
          component={Link}
          href="/sign-out"
          variant="primary"
          data-umami-event="user-sign-out"
        >
          Sign Out user
        </Button>
      </Stack>
    </>
  );
}
