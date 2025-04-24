import 'dotenv/config';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { initialize } from './modules/chat-completions/routes';
import { initialize as initializeDb } from './core/db';
import { logger, setLoggerLevel } from './core/logger';
import { isProduction } from './core/utils/is-production';

export type StartServerOptions = {
  port: number;
  dbConnectionString: string;
  logLevel?: string;
};

export async function startServer(
  options: StartServerOptions,
): Promise<() => void> {
  if (options.logLevel) {
    setLoggerLevel(options.logLevel);
  }

  const app = express();

  const db = await initializeDb(options.dbConnectionString, app);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug('req', req.method, req.url);
    next();
  });

  app.use(initialize());

  // Error handler middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error:', { err });

    if (req.path.startsWith('/api')) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({
        error: isProduction() ? 'An unexpected error occurred' : err.message,
      });
    } else {
      res.status(500).send('An unexpected error occurred');
    }
  });

  app.listen(options.port, () => {
    logger.info(`Server is running on port ${options.port}`);
  });

  return () => {
    app.listen().close();
    void db.close();
  };
}

// This checks if this file is being run directly (e.g. with `node server.ts`)
// rather than being imported as a module by another file.
// If true, it means this is the entry point of the application.
if (require.main === module) {
  void (async function () {
    const { environment } = await import('./core/environment.js');
    await startServer({
      port: environment.PORT,
      dbConnectionString: environment.DB,
      logLevel: environment.LOG_LEVEL,
    });
  })();
}
