import { TypeSymbols, container } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { NextFunction, Request, Response } from 'express';
import { getConfiguration } from '../../modules/configuration/get-configuration.js';
import { getTenantFromResponse } from '../../modules/tenants/get-tenant-from-response.js';
import { UNIQUE_ID_LOCAL_KEY } from './constants.js';

export interface HttpRequestHandler {
  handle(
    // biome-ignore lint/suspicious/noExplicitAny: Since this is a generic handler, we need to allow any type.
    req: Request<any>,
    // biome-ignore lint/suspicious/noExplicitAny: Since this is a generic handler, we need to allow any type.
    res: Response<any>,
    next: NextFunction
  ): void | Promise<void>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getHandlerUsingContainer(handler: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    const childContainer = container.createChildContainer();

    const metadata: Record<string, string> = {
      trxId: res.locals[UNIQUE_ID_LOCAL_KEY] ?? '',
    };
    if (getConfiguration().multiTenant) {
      metadata['tenantId'] = getTenantFromResponse(res).id;
    }
    const childLogger = childContainer
      .resolve<Logger>(TypeSymbols.LOGGER)
      .child(metadata);
    // Override the logger with the child logger, which will log additional information, only for this request.
    childContainer.register(TypeSymbols.LOGGER, {
      useValue: childLogger,
    });

    const handlerInstance = childContainer.resolve<HttpRequestHandler>(handler);

    return handlerInstance.handle(req, res, next);
  };
}
