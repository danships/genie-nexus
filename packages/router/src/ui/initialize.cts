import { cwd } from 'node:process';
import { parse } from 'url';
import type { Application } from 'express';
import next from 'next';

/**
 * This file is a .cts file on purpose, as a .(m)ts the
 * next import was not working correctly.
 */

export async function initializeUI(app: Application) {
  const nextApp = next({
    dir: cwd(),
    dev: process.env?.['NODE_ENV'] === 'development',
  });
  const handler = nextApp.getRequestHandler();

  await nextApp.prepare();

  app.use('/', async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handler(req, res, parsedUrl);
  });
}
