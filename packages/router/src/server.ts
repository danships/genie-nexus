import 'dotenv/config';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { initialize as initializeDb } from './core/db/index.js';
import { logger, setLoggerLevel } from './core/logger.js';
import { isProduction } from './core/utils/is-production.js';
import { initialize as initializeApiKey } from './modules/api-key/routes/index.js';
import { initialize as initializeChatCompletions } from './modules/chat-completions/routes/index.js';
import {
  type Configuration,
  setConfiguration,
} from './modules/configuration/get-configuration.js';
import { initialize as initializeConfiguration } from './modules/configuration/routes/index.js';
import { initialize as initializeWeave } from './modules/weave/routes/index.js';
import { initializeUI } from './ui/initialize.cjs';

export type StartServerOptions = {
  port: number;
  dbConnectionString: string;
  logLevel: string;
  integrateManagementInterface: boolean;
} & Configuration;

export async function startServer(
  options: StartServerOptions
): Promise<() => void> {
  if (options.logLevel) {
    setLoggerLevel(options.logLevel);
  }

  setConfiguration({
    multiTenant: options.multiTenant,
    devMode: options.devMode,
    authentication: options.authentication,
  });

  const app = express();
  app.disable('x-powered-by');

  const db = await initializeDb(options.dbConnectionString, app);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug('req', { method: req.method, url: req.url });
    next();
  });

  app.use(initializeChatCompletions());
  app.use(initializeWeave());
  app.use(initializeApiKey());
  app.use(initializeConfiguration());

  const { initialize: initializeAuthentication } = await import(
    './modules/auth/next-auth/initialize.js'
  );
  await initializeAuthentication();

  // Link the next app
  if (options.integrateManagementInterface) {
    await initializeUI(app);
  }

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error:', { err: `${error}` });

    if (res.headersSent) {
      return next(error);
    }

    if ('statusCode' in error && typeof error.statusCode === 'number') {
      res.status(error.statusCode);
    } else {
      res.status(500);
    }

    if (req.path.startsWith('/api')) {
      res.setHeader('Content-Type', 'application/json');
      res.json({
        error: isProduction() ? 'An unexpected error occurred' : error,
      });
    } else {
      res.send(
        isProduction()
          ? 'An unexpected error occurred'
          : `${error.message}: ${error.stack}`
      );
    }
  });

  app.listen(options.port, () => {
    logger.info(`Server is running on port ${options.port}`);
  });

  return () => {
    app.listen().close();
    void db?.close();
  };
}

// This checks if this file is being run directly (e.g. with `node server.ts`)
// rather than being imported as a module by another file.
// If true, it means this is the entry point of the application.
if (import.meta.url === new URL(process.argv[1] ?? '', 'file:').href) {
  void (async function () {
    const { environment } = await import('./core/environment.js');
    await startServer({
      port: environment.PORT,
      dbConnectionString: environment.DB,
      logLevel: environment.LOG_LEVEL,
      multiTenant: environment.MULTI_TENANT,
      integrateManagementInterface: environment.INTEGRATE_WEB,
      devMode: environment.isDevelopment,
      authentication: {
        type: environment.AUTH_METHOD,
      },
    });
  })();
}
