import { Router, json } from 'express';
import { getIp } from '../../../core/utils/get-ip.js';
import { getConfiguration } from '../../configuration/get-configuration.js';

export function initialize(): Router {
  const router = Router();

  router.use('/api/v1/tm/api/send', json());
  router.post('/api/v1/tm/api/send', async (req, res) => {
    const configuration = getConfiguration();

    if (configuration.devMode) {
      // don't forward the tracking
      res.json({ beep: 'boop' });
      return;
    }

    const requestBody = req.body;

    const updatedBody = {
      ...requestBody,
      payload: {
        ...requestBody.payload,
        website: getConfiguration().telemetry.websiteId,
      },
    };

    const clientIp = getIp(req);
    if (clientIp) {
      updatedBody.payload.ip = clientIp;
    }

    const cache = Array.isArray(req.headers['x-umami-cache'])
      ? (req.headers['x-umami-cache'][0] ?? '')
      : (req.headers['x-umami-cache'] ?? '');

    const response = await fetch(
      `${configuration.telemetry.hostUrl}/api/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.get('User-Agent') || '',
          'X-Umami-Cache': cache,
        },
        body: JSON.stringify(updatedBody),
      }
    );

    if (!configuration.devMode) {
      res.sendStatus(204);
      return;
    }

    const contentType = response.headers.get('content-type');
    const responseBody = await response.text();

    res
      .status(response.status)
      .set('Content-Type', contentType || 'application/json')
      .send(responseBody);
  });

  return router;
}
