import type { Request, Response } from 'express';
import { getDeploymentByName } from '../../deployments/get-deployment-by-name';
import { executeForHttp as executeDeploymentForHttp } from '../../deployments/execute';
import { generateStaticResponse } from '../../../weave-providers/static/generate-static-response';
import { checkApiKeyInRequest } from '../../api-key/check-api-key-in-request';
import { ApiKeyNotPresentError } from '../../api-key/errors/api-key-not-present-error';
import { ApiKeyValidationError } from '../../api-key/errors/api-key-validation-error';
import { proxyRequest } from '../../../weave-providers/http-proxy/proxy';

export async function processRequest(
  req: Request<{
    path: string | string[];
    deploymentName: string;
    tenantId: string;
  }>,
  res: Response,
) {
  const { deploymentName, tenantId, path } = req.params;

  const deployment = await getDeploymentByName(
    tenantId ?? '',
    deploymentName ?? '',
    'weave',
  );
  if (!deployment) {
    res.status(404).json({ error: 'Deployment not found' });
    return;
  }

  if (deployment.type === 'llm') {
    res.status(400).json({ error: 'LLM deployments are not supported' });
    return;
  }
  if (deployment.requiresApiKey) {
    try {
      await checkApiKeyInRequest(req, 'weave-api-key');
    } catch (error) {
      if (
        error instanceof ApiKeyValidationError ||
        error instanceof ApiKeyNotPresentError
      ) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
      }
      throw error;
    }
  }
  if (
    deployment.supportedMethods &&
    // @ts-expect-error request method is not typed, is a generic string
    !deployment.supportedMethods.includes(req.method.toLowerCase())
  ) {
    res.status(405).json({ error: 'Request method not supported' });
    return;
  }

  const { provider } = await executeDeploymentForHttp(deployment);

  switch (provider.type) {
    case 'http-proxy': {
      await proxyRequest(
        provider,
        req,
        res,
        Array.isArray(path) ? path.join('/') : path,
      );
      return;
    }

    case 'http-static': {
      generateStaticResponse(provider, res);
      return;
    }
    default: {
      throw new Error(`Unknown provider type ${provider.type}`);
    }
  }
}
