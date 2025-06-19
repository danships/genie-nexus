import {
  Lifecycle,
  TypeSymbols,
  inject,
  scoped,
  singleton,
} from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { WeaveAction, WeaveRequestContext } from '@genie-nexus/types';

// Maximum allowed delay in milliseconds (5 seconds)
const MAX_DELAY_MS = 5000;

@singleton()
@scoped(Lifecycle.ContainerScoped)
export class ExecuteWeaveAction {
  constructor(@inject(TypeSymbols.LOGGER) private readonly logger: Logger) {}

  public async execute(
    action: WeaveAction,
    context: WeaveRequestContext
  ): Promise<void> {
    this.logger.debug('Executing action', {
      actionType: action.type,
      context: {
        path: context.path,
        method: context.method,
      },
    });

    switch (action.type) {
      case 'addRequestHeader':
      case 'setRequestHeader':
        context.requestHeaders[action.key] = action.value;
        this.logger.debug('Updated request header', {
          key: action.key,
          value: action.value,
        });
        break;
      case 'removeRequestHeader':
        delete context.requestHeaders[action.key];
        this.logger.debug('Removed request header', { key: action.key });
        break;
      case 'addResponseHeader':
      case 'setResponseHeader':
        context.responseHeaders[action.key] = action.value;
        this.logger.debug('Updated response header', {
          key: action.key,
          value: action.value,
        });
        break;
      case 'removeResponseHeader':
        delete context.responseHeaders[action.key];
        this.logger.debug('Removed response header', { key: action.key });
        break;
      case 'updateResponseBody':
        context.responseBody = action.value;
        this.logger.debug('Updated response body', { value: action.value });
        break;
      case 'updateResponseStatusCode':
        context.responseStatusCode = parseInt(action.value, 10);
        this.logger.debug('Updated response status code', {
          statusCode: context.responseStatusCode,
        });
        break;
      case 'transformData':
        try {
          // For now, we'll just log that this action was executed
          // In the future, this could be integrated with @supersave/expression
          this.logger.debug('Transform data action executed', {
            expression: action.expression,
            context: {
              path: context.path,
              method: context.method,
              requestHeaders: context.requestHeaders,
              responseHeaders: context.responseHeaders,
              responseStatusCode: context.responseStatusCode,
            },
          });
        } catch (error) {
          this.logger.error('Error executing transform data action', { error });
          throw error;
        }
        break;
      case 'filter':
        try {
          // For now, we'll just log that this action was executed
          // In the future, this could be integrated with @supersave/expression
          this.logger.debug('Filter action executed', {
            expression: action.expression,
            context: {
              path: context.path,
              method: context.method,
              requestHeaders: context.requestHeaders,
              responseHeaders: context.responseHeaders,
              responseStatusCode: context.responseStatusCode,
            },
          });
        } catch (error) {
          this.logger.error('Error executing filter action', { error });
          throw error;
        }
        break;
      case 'delay':
        const delayMs = Math.min(action.ms, MAX_DELAY_MS);
        if (delayMs !== action.ms) {
          this.logger.warning('Delay action exceeded maximum delay limit', {
            requested: action.ms,
            actual: delayMs,
            maxAllowed: MAX_DELAY_MS,
            context: {
              path: context.path,
              method: context.method,
            },
          });
        }
        this.logger.debug('Executing delay action', {
          ms: delayMs,
          context: {
            path: context.path,
            method: context.method,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        break;
      case 'log':
        this.logger.info(action.message || 'Log action executed', {
          context: {
            path: context.path,
            method: context.method,
            requestHeaders: context.requestHeaders,
            responseHeaders: context.responseHeaders,
            responseStatusCode: context.responseStatusCode,
          },
        });
        break;
      case 'setProvider':
        context.providerId = action.providerId;
        this.logger.debug('Set provider', { providerId: action.providerId });
        break;
    }
  }
}
