import type { SuperSave } from 'supersave';

export type MigrationDefinition = {
  migrate: (superSave: SuperSave) => Promise<void>;
  rollback?: (superSave: SuperSave) => Promise<void>;
};
