import type { Provider } from '@genie-nexus/database';
import type { ProviderResponse } from '../types.js';

export function generateStaticResponse(provider: Provider): ProviderResponse {
  if (provider.type !== 'http-static') {
    throw new Error('Provider is not a static provider');
  }

  // Prepare response headers
  const headers: Record<string, string> = {};
  if (provider.responseHeaders) {
    provider.responseHeaders.forEach((header) => {
      switch (header.operation) {
        case 'set':
          headers[header.key] = header.value ?? '';
          break;
        case 'add':
          headers[header.key] = headers[header.key]
            ? `${headers[header.key]}, ${header.value}`
            : (header.value ?? '');
          break;
        case 'remove':
          delete headers[header.key];
          break;
      }
    });
  }

  return {
    statusCode: provider.statusCode || 200,
    headers,
    body: Buffer.from(provider.body ?? ''),
  };
}
