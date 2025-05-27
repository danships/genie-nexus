import type { Request, Response } from 'express';
import { proxyRequest } from '../../../weave-providers/http-proxy/proxy.js';
import { generateStaticResponse } from '../../../weave-providers/static/generate-static-response.js';
import { checkApiKeyInRequest } from '../../api-key/check-api-key-in-request.js';
import { ApiKeyNotPresentError } from '../../api-key/errors/api-key-not-present-error.js';
import { ApiKeyValidationError } from '../../api-key/errors/api-key-validation-error.js';
import { executeForHttp as executeDeploymentForHttp } from '../../deployments/execute.js';
import { getDeploymentByName } from '../../deployments/get-deployment-by-name.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import type { ResponseLocalsTenant } from '../../tenants/middleware/types.js';

export async function processRequest(
  req: Request<{
    path: string | string[];
    deploymentName: string;
  }>,
  res: Response<unknown, ResponseLocalsTenant>
) {
  const { deploymentName, path } = req.params;
  const tenant = getTenantFromResponse(res);

  const deployment = await getDeploymentByName(
    tenant.id,
    deploymentName ?? '',
    'weave'
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
        Array.isArray(path) ? path.join('/') : (path ?? '')
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
