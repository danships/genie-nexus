import type { Application } from 'express';
import next from 'next';
import { parse } from 'url';
import path from 'path';

const managementPath = path.dirname(
  require.resolve('@genie-nexus/management/package.json'),
);

export async function initializeUI(app: Application) {
  const nextApp = next({
    dir: managementPath,
  });
  const handler = nextApp.getRequestHandler();

  await nextApp.prepare();

  app.use('/', async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handler(req, res, parsedUrl);
  });
}
