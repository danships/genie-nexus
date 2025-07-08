import 'reflect-metadata';
import 'dotenv/config';
import {
  TypeSymbols,
  container,
  inject,
  singleton,
} from '@genie-nexus/container';
import type { Express, NextFunction, Request, Response } from 'express';
import { initialize as initializeDependencyInjection } from './core/dependency-injection/initialize.js';
import { isProduction } from './core/utils/is-production.js';
import { initialize as initializeApiKey } from './modules/api-key/routes/index.js';
import { initialize as initializeAuthentication } from './modules/auth/next-auth/initialize.js';
import { initialize as initializeChatCompletions } from './modules/chat-completions/routes/index.js';
import { initialize as initializeTelemetry } from './modules/telemetry/routes/index.js';

import type { Logger } from '@genie-nexus/logger';
import { InitializeStorage } from '@genie-nexus/storage';
import type { SuperSave } from 'supersave';
import { RouterTypeSymbols } from './core/dependency-injection/router-type-symbols.js';
import { GetApplicationInformation } from './core/get-application-information.js';
import { uniqueIdMiddleware } from './core/http/unique-id-middleware.js';
import {
  type Configuration,
  setConfiguration,
} from './modules/configuration/get-configuration.js';
import { initialize as initializeConfiguration } from './modules/configuration/routes/index.js';
import { SendTelemetryEvent } from './modules/telemetry/send-event.js';
import { SendPingEvent } from './modules/telemetry/send-ping-event.js';
import { initialize as initializeWeave } from './modules/weave/routes/index.js';
import { initializeUI } from './ui/initialize.cjs';

export type StartServerOptions = {
  port: number;
  integrateManagementInterface: boolean;
} & Configuration;

@singleton()
export class GenieNexusServer {
  constructor(
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    @inject(RouterTypeSymbols.EXPRESS_APP) private readonly app: Express,
    @inject(TypeSymbols.DB) private readonly db: SuperSave,
    @inject(GetApplicationInformation)
    private readonly getApplicationVersion: GetApplicationInformation,
    @inject(SendTelemetryEvent)
    private readonly sendTelemetryEvent: SendTelemetryEvent,
    @inject(SendPingEvent)
    private readonly sendPingEvent: SendPingEvent
  ) {}

  public async startServer(options: StartServerOptions): Promise<() => void> {
    setConfiguration({
      multiTenant: options.multiTenant,
      devMode: options.devMode,
      authentication: options.authentication,
      telemetry: options.telemetry,
      runtimeEnvironment: options.runtimeEnvironment,
      db: options.db,
    });

    this.app.disable('x-powered-by');
    this.app.set('trust proxy', true);

    void this.sendTelemetryEvent
      .sendEvent({
        type: 'start',
        configuration: { authentication: options.authentication.type },
      })
      .then(() => this.sendPingEvent.sendEvent());

    setInterval(
      () => {
        void this.sendPingEvent.sendEvent();
      },
      1000 * 60 * 60 * 24
    ); // 24 hours

    const applicationInformation =
      await this.getApplicationVersion.getApplicationInformation();

    if (options.devMode) {
      this.app.use((req: Request, _res: Response, next: NextFunction) => {
        this.logger.debug('req', { method: req.method, url: req.url });
        next();
      });
      this.app.get('/version', (_req: Request, res: Response) => {
        res.json({ version: applicationInformation.version });
      });
    }

    this.app.use(uniqueIdMiddleware);

    this.app.get('/_health', (_req: Request, res: Response) => {
      res.send('OK');
    });

    this.app.use(initializeChatCompletions());
    this.app.use(initializeWeave());
    this.app.use(initializeApiKey());
    this.app.use(initializeConfiguration());
    this.app.use(initializeTelemetry());

    await initializeAuthentication();

    // Link the next app
    if (options.integrateManagementInterface) {
      await initializeUI(this.app);
    }

    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        this.logger.error('Error:', { err: `${error}` });

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
      }
    );

    this.app.listen(options.port, () => {
      this.logger.info(`Server is running on port ${options.port}`, {
        version: applicationInformation.version,
      });
    });

    return () => {
      this.app.listen().close();
      void this.db.close();
    };
  }
}

// This checks if this file is being run directly (e.g. with `node server.ts`)
// rather than being imported as a module by another file.
// If true, it means this is the entry point of the application.
if (import.meta.url === new URL(process.argv[1] ?? '', 'file:').href) {
  void (async function () {
    const { environment } = await import('./core/environment.js');

    let dbConnectionString = environment.DB;
    if (
      environment.DB.startsWith('sqlite') &&
      environment.DB === 'sqlite://db.sqlite'
    ) {
      // The default db, we write that to a specific path. We cannot use DI yet to set up the storage path,
      // as that has not been initialized yet.
      const initializeStorage = new InitializeStorage();
      const storagePath = await initializeStorage.initialize(
        environment.GNXS_RUNTIME_ENVIRONMENT === 'docker'
      );
      dbConnectionString = `sqlite://${storagePath}/db.sqlite`;
    }

    await initializeDependencyInjection({
      logLevel: environment.LOG_LEVEL,
      dbConnectionString,
    });

    const server = container.resolve(GenieNexusServer);

    await server.startServer({
      port: environment.PORT,
      multiTenant: environment.MULTI_TENANT,
      integrateManagementInterface: environment.INTEGRATE_WEB,
      devMode: environment.isDevelopment || environment.DEBUG,
      authentication: {
        type: environment.AUTH_METHOD,
      },
      telemetry: {
        websiteId: environment.TELEMETRY_SITE_ID,
        hostUrl: environment.TELEMETRY_HOST_URL,
      },
      runtimeEnvironment: environment.GNXS_RUNTIME_ENVIRONMENT,
      db: environment.DB.startsWith('mysql') ? 'mysql' : 'sqlite',
    });
  })();
}
