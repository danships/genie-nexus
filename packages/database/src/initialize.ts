import type { Collection, Hooks } from 'supersave';
import { SuperSave } from 'supersave';
import {
  ApiKey,
  Deployment,
  LlmFlow,
  Migration,
  NextAuthUser,
  Provider,
  StoredConfiguration,
  Tenant,
  WeaveFlow,
} from './entities.js';
import { migrate } from './migrate/index.js';

let superSavePromise: Promise<SuperSave> | undefined;
let superSave!: SuperSave;

type Options = {
  connectionString: string;
  executeMigrations: boolean;
  hooks?: Hooks;
};

function addHooksToCollection(
  collection: Collection,
  hooks: Hooks | undefined
) {
  if (!hooks) {
    return collection;
  }

  return { ...collection, hooks: [hooks, ...(collection.hooks ?? [])] };
}

export async function initialize({
  connectionString,
  executeMigrations,
  hooks,
}: Options) {
  superSavePromise = SuperSave.create(connectionString);
  const db = await superSavePromise;

  await db.addCollection(addHooksToCollection(Provider, hooks));
  await db.addCollection(addHooksToCollection(Deployment, hooks));
  await db.addCollection(addHooksToCollection(ApiKey, hooks));
  await db.addCollection(addHooksToCollection(Tenant, hooks));
  await db.addCollection(addHooksToCollection(WeaveFlow, hooks));
  await db.addCollection(addHooksToCollection(LlmFlow, hooks));

  await db.addCollection(addHooksToCollection(Migration, hooks));

  await db.addEntity(NextAuthUser);
  await db.addEntity(StoredConfiguration);

  if (executeMigrations) {
    await migrate(db);
  }

  superSave = db;
  return db;
}

export async function getDB() {
  await superSavePromise;
  return superSave;
}
