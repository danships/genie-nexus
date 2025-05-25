import { initialize, getDB as getGenieNexusDB } from '@genie-nexus/database';
import { environment } from '@lib/environment';

let initialized = false;

export async function getDb() {
  if (initialized) {
    return getGenieNexusDB();
  }

  await initialize({
    connectionString: environment.DB,
    executeMigrations: false,
  });
  initialized = true;
  return getDb();
}
