import { Skeleton } from '@mantine/core';

export default function Loading() {
  return (
    <>
      <Skeleton height={32} mb="lg" width="30%" />
      <Skeleton height={120} radius="md" mb="md" />
      <Skeleton height={120} radius="md" mb="md" />
      <Skeleton height={120} radius="md" mb="md" />
    </>
  );
}
