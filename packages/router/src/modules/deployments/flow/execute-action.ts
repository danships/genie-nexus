import type { Action, RequestContext } from '@genie-nexus/types';
import { getLogger } from '../../../core/get-logger.js';

// Maximum allowed delay in milliseconds (5 seconds)
const MAX_DELAY_MS = 5000;

export async function executeAction(
  action: Action,
  context: RequestContext
): Promise<void> {
  const logger = getLogger();

  logger.debug('Executing action', {
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
      logger.debug('Updated request header', {
        key: action.key,
        value: action.value,
      });
      break;
    case 'removeRequestHeader':
      delete context.requestHeaders[action.key];
      logger.debug('Removed request header', { key: action.key });
      break;
    case 'addResponseHeader':
    case 'setResponseHeader':
      context.responseHeaders[action.key] = action.value;
      logger.debug('Updated response header', {
        key: action.key,
        value: action.value,
      });
      break;
    case 'removeResponseHeader':
      delete context.responseHeaders[action.key];
      logger.debug('Removed response header', { key: action.key });
      break;
    case 'updateResponseBody':
      context.responseBody = action.value;
      logger.debug('Updated response body', { value: action.value });
      break;
    case 'updateResponseStatusCode':
      context.responseStatusCode = parseInt(action.value, 10);
      logger.debug('Updated response status code', {
        statusCode: context.responseStatusCode,
      });
      break;
    case 'transformData':
      try {
        // For now, we'll just log that this action was executed
        // In the future, this could be integrated with @supersave/expression
        logger.debug('Transform data action executed', {
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
        logger.error('Error executing transform data action', { error });
        throw error;
      }
      break;
    case 'filter':
      try {
        // For now, we'll just log that this action was executed
        // In the future, this could be integrated with @supersave/expression
        logger.debug('Filter action executed', {
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
        logger.error('Error executing filter action', { error });
        throw error;
      }
      break;
    case 'delay':
      const delayMs = Math.min(action.ms, MAX_DELAY_MS);
      if (delayMs !== action.ms) {
        logger.warn('Delay action exceeded maximum delay limit', {
          requested: action.ms,
          actual: delayMs,
          maxAllowed: MAX_DELAY_MS,
          context: {
            path: context.path,
            method: context.method,
          },
        });
      }
      logger.debug('Executing delay action', {
        ms: delayMs,
        context: {
          path: context.path,
          method: context.method,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      break;
    case 'log':
      logger.info(action.message || 'Log action executed', {
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
      logger.debug('Set provider', { providerId: action.providerId });
      break;
  }
}
