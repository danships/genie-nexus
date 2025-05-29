import type { Flow, RequestContext } from '@genie-nexus/types';

export function executeAction(
  action: Flow['steps'][number]['action'],
  context: RequestContext
): void {
  switch (action.type) {
    case 'addRequestHeader':
    case 'setRequestHeader':
      context.requestHeaders[action.key] = action.value;
      break;
    case 'removeRequestHeader':
      delete context.requestHeaders[action.key];
      break;
    case 'addResponseHeader':
    case 'setResponseHeader':
      context.responseHeaders[action.key] = action.value;
      break;
    case 'removeResponseHeader':
      delete context.responseHeaders[action.key];
      break;
    case 'updateResponseBody':
      context.responseBody = action.value;
      break;
    case 'updateResponseStatusCode':
      context.responseStatusCode = parseInt(action.value, 10);
      break;
  }
}
