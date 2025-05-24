import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import type { WeaveHttpProxyProvider } from '@genie-nexus/types';
import { logger } from '../../core/logger.js';
import { validateUrlDestination } from '../../core/utils/validate-url-destination.js';

export const NOT_ALLOWED_REQUEST_HEADERS = ['host', 'authorization'];

export async function proxyRequest(
  provider: WeaveHttpProxyProvider,
  req: ExpressRequest<unknown, unknown>,
  res: ExpressResponse,
  path: string,
) {
  // Construct the target URL by appending the path to the base URL
  const targetUrl = new URL(path, provider.baseUrl).toString();
  logger.debug('Proxying request', { targetUrl });

  // Validate the URL is not pointing to internal IP ranges
  await validateUrlDestination(targetUrl);

  // Prepare headers for the proxied request
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (NOT_ALLOWED_REQUEST_HEADERS.includes(key.toLowerCase())) {
      continue;
    }

    if (typeof value === 'string') {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(', ');
    }
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
    // Forward the request to the target URL
    const fetchResponse = await fetch(targetUrl, {
      method: req.method,
      headers: new Headers({
        ...headers,
        'accept-encoding': 'gzip, deflate, br',
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: req.body }),
    });

    // Get the response body
    const body = await fetchResponse.arrayBuffer();

    // Set the status code
    res.status(fetchResponse.status);

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

    /**
     * Express updates the Content-Type header and adds a charset.
     * //TODO https://stackoverflow.com/a/59449326/13944042
     */

    // Set the response headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.set(key, value);
    });

    // Send the response body
    res.send(Buffer.from(body));
  } catch (error) {
    logger.error('Proxy error:', { err: error });
    throw error;
  }
}
