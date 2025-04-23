import 'dotenv/config';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { initialize } from './modules/chat-completions/routes';
import { logger, setLoggerLevel } from './core/logger';
import type { Configuration } from './modules/configuration/validate';
import { load as loadConfiguration } from './modules/configuration/load';
import { setConfiguration } from './modules/configuration/configuration';
import { environment } from './core/environment';

export function startServer(configuration: Configuration): () => void {
  setConfiguration(configuration);
  setLoggerLevel(environment.LOG_LEVEL);

  const app = express();

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug('req', req.method, req.url);
    next();
  });

  app.use(initialize());

  app.listen(configuration.port, () => {
    logger.info(`Server is running on port ${configuration.port}`);
  });

  return () => {
    app.listen().close();
  };
}

// This checks if this file is being run directly (e.g. with `node server.ts`)
// rather than being imported as a module by another file.
// If true, it means this is the entry point of the application.
if (require.main === module) {
  let configurationFile = 'config.json';
  if (process.argv[2] === '--config') {
    configurationFile = process.argv[3] ?? 'config.json';
  }

  void (async function () {
    const configuration = await loadConfiguration(configurationFile);
    startServer({
      ...configuration,
      port: environment.PORT,
    });
  })();
}
