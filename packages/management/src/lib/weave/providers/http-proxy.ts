import { TypeSymbols } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type {
  WeaveHttpProxyProvider,
  WeaveRequestContext,
} from '@genie-nexus/types';
import { getContainer } from '@lib/core/get-container';
import type { ProviderResponse } from '../types';
import { validateUrlDestination } from '../validate-url-destination';

const NOT_ALLOWED_REQUEST_HEADERS = ['host', 'authorization'];

export async function proxyRequest(
  provider: WeaveHttpProxyProvider,
  request: WeaveRequestContext,
  path: string
): Promise<ProviderResponse> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);

  const targetUrl = new URL(path, provider.baseUrl).toString();
  logger.debug('Proxying request', { targetUrl });

  await validateUrlDestination(targetUrl);

  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(request.requestHeaders)) {
    if (NOT_ALLOWED_REQUEST_HEADERS.includes(key.toLowerCase())) {
      continue;
    }
    headers[key] = value;
  }

  if (provider.requestHeaders) {
    for (const header of provider.requestHeaders) {
      switch (header.operation) {
        case 'set':
          headers[header.key] = header.value ?? '';
          break;
        case 'add':
          if (header.value) {
            headers[header.key] = headers[header.key]
              ? `${headers[header.key]}, ${header.value}`
              : header.value;
          }
          break;
        case 'remove':
          delete headers[header.key];
          break;
      }
    }
  }

  try {
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: new Headers({
        ...headers,
        'accept-encoding': 'gzip, deflate, br',
      }),
    };

    if (
      request.method.toUpperCase() !== 'GET' &&
      request.method.toUpperCase() !== 'HEAD' &&
      request.requestBody !== undefined
    ) {
      if (typeof request.requestBody === 'string') {
        fetchOptions.body = request.requestBody;
      } else if (request.requestBody instanceof Buffer) {
        fetchOptions.body = request.requestBody;
      } else {
        fetchOptions.body = JSON.stringify(request.requestBody);
      }
    }

    const fetchResponse = await fetch(targetUrl, fetchOptions);

    const body = await fetchResponse.arrayBuffer();

    const responseHeaders: Record<string, string> = {};
    fetchResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        responseHeaders[key] = value;
      }
    });

    if (provider.responseHeaders) {
      for (const header of provider.responseHeaders) {
        switch (header.operation) {
          case 'set':
            responseHeaders[header.key] = header.value ?? '';
            break;
          case 'add':
            if (header.value) {
              responseHeaders[header.key] = responseHeaders[header.key]
                ? `${responseHeaders[header.key]}, ${header.value}`
                : header.value;
            }
            break;
          case 'remove':
            delete responseHeaders[header.key];
            break;
        }
      }
    }

    return {
      statusCode: fetchResponse.status,
      headers: responseHeaders,
      body: Buffer.from(body),
    };
  } catch (error) {
    logger.error('Proxy error:', { err: error });
    throw error;
  }
}
