import path from 'path';
import { parse } from 'url';
import type { Application } from 'express';
import next from 'next';

/**
 * This file is a .ctj file on purpose, as a .(m)ts the
 * next import was not working correctly.
 */

const managementPath = path.dirname(
  require.resolve('@genie-nexus/management/package.json')
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
