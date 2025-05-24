import type { SuperSave } from 'supersave';
import { Migration } from '../entities.js';
import { tenantAndSampleData } from './migrations/0001_tenant-and-sample-data.js';
import type { MigrationDefinition } from './types.js';
import type { Migration as MigrationType } from '../types.js';
import Debug from 'debug';

const logger = Debug('genie-nexus:db:migrate');

const MIGRATIONS: Record<string, MigrationDefinition> = {
  '0001': tenantAndSampleData,
};

export async function migrate(superSave: SuperSave) {
  const migrationRepository = superSave.getRepository<MigrationType>(
    Migration.name,
    Migration.namespace,
  );

  const lastMigration = await migrationRepository.getOneByQuery(
    migrationRepository.createQuery().sort('version', 'desc'),
  );
  logger('Last ran migration', { last: lastMigration });

  const migrationsToRun =
    lastMigration === null
      ? Object.keys(MIGRATIONS)
      : Object.keys(MIGRATIONS).filter(
          (migration) => migration > lastMigration['version'],
        );

  logger('Migrations to run', { count: migrationsToRun.length });

  for (const migration of migrationsToRun) {
    logger('Running migration', { key: migration });
    await MIGRATIONS[migration]?.migrate(superSave);
    await migrationRepository.create({
      version: migration,
    });
  }
}
