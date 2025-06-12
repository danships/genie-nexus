import type { WeaveRequestContext } from '@genie-nexus/types';

export function getFieldValue(
  field: string,
  context: WeaveRequestContext
): unknown {
  const [section, key] = field.split('.');
  switch (section) {
    case 'request':
      switch (key) {
        case 'path':
          return context.path;
        case 'method':
          return context.method;
        case 'headers':
          return context.requestHeaders;
        case 'body':
          return context.requestBody;
        default:
          return undefined;
      }
    case 'response':
      switch (key) {
        case 'headers':
          return context.responseHeaders;
        case 'body':
          return context.responseBody;
        case 'statusCode':
          return context.responseStatusCode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
}
