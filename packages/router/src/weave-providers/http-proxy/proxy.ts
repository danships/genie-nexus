import type { WeaveHttpProxyProvider } from '@genie-nexus/types';
import type { RequestContext } from '@genie-nexus/types';
import { logger } from '../../core/logger.js';
import { validateUrlDestination } from '../../core/utils/validate-url-destination.js';
import { ProviderResponse } from '../types.js';

export const NOT_ALLOWED_REQUEST_HEADERS = ['host', 'authorization'];

export async function proxyRequest(
  provider: WeaveHttpProxyProvider,
  request: RequestContext,
  path: string
): Promise<ProviderResponse> {
  // Construct the target URL by appending the path to the base URL
  const targetUrl = new URL(path, provider.baseUrl).toString();
  logger.debug('Proxying request', { targetUrl });

  // Validate the URL is not pointing to internal IP ranges
  await validateUrlDestination(targetUrl);

  // Prepare headers for the proxied request
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(request.requestHeaders)) {
    if (NOT_ALLOWED_REQUEST_HEADERS.includes(key.toLowerCase())) {
      continue;
    }

    headers[key] = value;
  }

  // Apply request header modifications from the provider configuration
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
    // Prepare the fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: new Headers({
        ...headers,
        'accept-encoding': 'gzip, deflate, br',
      }),
    };

    // Add body for non-GET/HEAD requests
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

    // Forward the request to the target URL
    const fetchResponse = await fetch(targetUrl, fetchOptions);

    // Get the response body
    const body = await fetchResponse.arrayBuffer();

    // Apply response header modifications from the provider configuration
    const responseHeaders: Record<string, string> = {};
    fetchResponse.headers.forEach((value, key) => {
      // Skip content-encoding header as we handle the decompression
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
