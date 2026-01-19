import { InitializeStorage } from '@genie-nexus/storage';
import { environment } from '@lib/environment';
import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { createPool } from 'mysql2/promise';

async function getDatabase() {
  let dbUrl = environment.DB;

  if (environment.isDevelopment && process.env['DB_DEV']) {
    dbUrl = process.env['DB_DEV'];
  } else if (dbUrl === 'sqlite://db.sqlite') {
    const initializeStorage = new InitializeStorage();
    const storagePath = await initializeStorage.initialize(
      environment.GNXS_RUNTIME_ENVIRONMENT === 'docker'
    );
    dbUrl = `sqlite://${storagePath}/db.sqlite`;
  }

  if (dbUrl.startsWith('sqlite://')) {
    const filename = dbUrl.replace('sqlite://', '');
    return new Database(filename);
  }

  if (dbUrl.startsWith('mysql://')) {
    return createPool(dbUrl);
  }

  throw new Error(`Unsupported database protocol: ${dbUrl}`);
}

export const auth = betterAuth({
  database: await getDatabase(),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    // @ts-expect-error - strategy exists in Better-Auth but might have type issues with some configurations
    strategy: 'jwt',
  },
  advanced: {
    cookiePrefix: 'genie-nexus',
  },
});
