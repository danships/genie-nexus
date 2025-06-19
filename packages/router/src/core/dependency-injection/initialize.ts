import { TypeSymbols, container } from '@genie-nexus/container';
import {
  type ApiKeyRepository,
  type DeploymentRepository,
  type LlmFlowRepository,
  type NextAuthUserRepository,
  type ProviderRepository,
  type TenantRepository,
  type WeaveFlowRepository,
  getApiKeyRepository,
  getDeploymentRepository,
  getLlmFlowRepository,
  getNextAuthUserRepository,
  getTenantRepository,
  getWeaveFlowRepository,
} from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import { LoggerImplementation } from '@genie-nexus/logger/winston';
import express, { type Express } from 'express';
import {
  getProviderRepository,
  initialize as initializeDb,
} from '../db/index.js';
import { RouterTypeSymbols } from './router-type-symbols.js';

type Options = {
  logLevel: string;
  dbConnectionString: string;
};

export async function initialize(options: Options) {
  if (!container.isRegistered(TypeSymbols.LOGGER)) {
    const logger = new LoggerImplementation({ app: 'gnxs-r' });
    logger.setLogLevel(options.logLevel);

    container.register<Logger>(TypeSymbols.LOGGER, {
      useValue: logger,
    });
  }

  const app = express();
  container.register<Express>(RouterTypeSymbols.EXPRESS_APP, {
    useValue: app,
  });

  const db = await initializeDb(options.dbConnectionString, app);
  container.register(TypeSymbols.DB, {
    useValue: db,
  });

  const providerRepository = await getProviderRepository();
  container.register<ProviderRepository>(TypeSymbols.PROVIDER_REPOSITORY, {
    useValue: providerRepository,
  });

  const deploymentRepository = await getDeploymentRepository();
  container.register<DeploymentRepository>(TypeSymbols.DEPLOYMENT_REPOSITORY, {
    useValue: deploymentRepository,
  });

  const apiKeyRepository = await getApiKeyRepository();
  container.register<ApiKeyRepository>(TypeSymbols.API_KEY_REPOSITORY, {
    useValue: apiKeyRepository,
  });

  const tenantRepository = await getTenantRepository();
  container.register<TenantRepository>(TypeSymbols.TENANT_REPOSITORY, {
    useValue: tenantRepository,
  });

  const nextAuthUserRepository = await getNextAuthUserRepository();
  container.register<NextAuthUserRepository>(
    TypeSymbols.NEXT_AUTH_USER_REPOSITORY,
    {
      useValue: nextAuthUserRepository,
    }
  );

  const weaveFlowRepository = await getWeaveFlowRepository();
  container.register<WeaveFlowRepository>(TypeSymbols.WEAVE_FLOW_REPOSITORY, {
    useValue: weaveFlowRepository,
  });

  const llmFlowRepository = await getLlmFlowRepository();
  container.register<LlmFlowRepository>(TypeSymbols.LLM_FLOW_REPOSITORY, {
    useValue: llmFlowRepository,
  });
}
