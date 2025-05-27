import type { Application, Router } from 'express';
import type { Collection, Hooks } from 'supersave';
import { SuperSave } from 'supersave';
import {
  ApiKey,
  Deployment,
  Migration,
  NextAuthUser,
  Provider,
  Tenant,
} from './entities.js';
import { migrate } from './migrate/index.js';

let superSavePromise: Promise<SuperSave> | undefined;
let superSave!: SuperSave;

type Options = {
  connectionString: string;
  executeMigrations: boolean;
  app?: Application | Router;
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
  app,
  executeMigrations,
  hooks,
}: Options) {
  superSavePromise = SuperSave.create(connectionString);
  const db = await superSavePromise;

  await db.addCollection(addHooksToCollection(Provider, hooks));
  await db.addCollection(addHooksToCollection(Deployment, hooks));
  await db.addCollection(addHooksToCollection(ApiKey, hooks));
  await db.addCollection(addHooksToCollection(Tenant, hooks));
  await db.addCollection(addHooksToCollection(Migration, hooks));
  await db.addEntity(NextAuthUser);

  if (executeMigrations) {
    await migrate(db);
  }

  if (app) {
    const collectionRouter = await db.getRouter('/api/v1/collections');

    app.use(collectionRouter);
  }

  superSave = db;
  return db;
}

export async function getDB() {
  await superSavePromise;
  return superSave;
}
