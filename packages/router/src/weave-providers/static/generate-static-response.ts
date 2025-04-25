import type { Provider } from '../../core/db/types';
import type { Response } from 'express';

export function generateStaticResponse(provider: Provider, res: Response) {
  if (provider.type !== 'http-static') {
    throw new Error('Provider is not a static provider');
  }

  // Set response headers if defined
  if (provider.responseHeaders) {
    provider.responseHeaders.forEach((header) => {
      switch (header.operation) {
        case 'set':
          res.set(header.key, header.value);
          break;
        case 'add':
          res.append(header.key, header.value);
          break;
        case 'remove':
          res.removeHeader(header.key);
          break;
      }
    });
  }

  // Set status code if defined, otherwise default to 200
  res.status(provider.statusCode || 200);

  res.send(provider.body).end();
}
