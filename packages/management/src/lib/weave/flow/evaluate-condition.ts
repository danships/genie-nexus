import type {
  Condition,
  LlmRequestContext,
  WeaveRequestContext,
} from '@genie-nexus/types';

export function evaluateCondition<
  T extends WeaveRequestContext | LlmRequestContext,
>(condition: Condition, context: T): boolean {
  let value: string | undefined;
  if (condition.field === 'path' && 'path' in context) {
    value = context.path;
  } else if (condition.field === 'method' && 'method' in context) {
    value = context.method;
  } else if (condition.field.startsWith('requestHeaders.')) {
    const headerKey = condition.field.substring('requestHeaders.'.length);
    if ('requestHeaders' in context) {
      value = context.requestHeaders[headerKey];
    }
  } else if (condition.field.startsWith('responseHeaders.')) {
    const headerKey = condition.field.substring('responseHeaders.'.length);
    if ('responseHeaders' in context) {
      value = context.responseHeaders[headerKey];
    }
  } else if (
    condition.field === 'responseStatusCode' &&
    'responseStatusCode' in context
  ) {
    value = String(context.responseStatusCode);
  }

  switch (condition.type) {
    case 'equals':
      return value === condition.value;
    case 'notEquals':
      return value !== condition.value;
    case 'contains':
      return value !== undefined && value.includes(condition.value);
    case 'doesNotContain':
      return value === undefined || !value.includes(condition.value);
    case 'isEmpty':
      return value === undefined || value === '';
    case 'isNotEmpty':
      return value !== undefined && value !== '';
    default:
      return false;
  }
}
