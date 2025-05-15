import type { LocalBaseEntity } from '@genie-nexus/database';
import 'server-only';

const COLLECTION_API_URL = process.env['NEXT_PUBLIC_API_BASE_URL'];

export async function getEntity<T extends LocalBaseEntity>(
  collection: string,
  id: string,
) {
  // TODO add the auth details / cookie here
  const response = await fetch(
    `${COLLECTION_API_URL}/collections/${collection}/${id}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch entity: ${response.statusText}`);
  }
  const data = (await response.json()) as { data: T };

  return data.data;
}
