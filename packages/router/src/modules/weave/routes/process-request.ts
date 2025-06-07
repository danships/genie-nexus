import type { RequestContext } from '@genie-nexus/types';
import type { Request, Response } from 'express';
import { checkApiKeyInRequest } from '../../api-key/check-api-key-in-request.js';
import { ApiKeyNotPresentError } from '../../api-key/errors/api-key-not-present-error.js';
import { ApiKeyValidationError } from '../../api-key/errors/api-key-validation-error.js';
import { executeForHttp as executeDeploymentForHttp } from '../../deployments/execute.js';
import { getDeploymentBySlug } from '../../deployments/get-deployment-by-slug.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import type { ResponseLocalsTenant } from '../../tenants/middleware/types.js';

export async function processRequest(
  req: Request<{
    path: string | string[];
    deploymentSlug: string;
  }>,
  res: Response<unknown, ResponseLocalsTenant>
) {
  const { deploymentSlug, path } = req.params;
  const tenant = getTenantFromResponse(res);

  const deployment = await getDeploymentBySlug(
    tenant.id,
    deploymentSlug ?? '',
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

  const flattenedPath = Array.isArray(path) ? path.join('/') : (path ?? '');
  // Create the request context
  const requestContext: RequestContext = {
    path: !flattenedPath.startsWith('/') ? `/${flattenedPath}` : flattenedPath,
    method: req.method,
    requestHeaders: req.headers as Record<string, string>,
    requestBody: req.body,
    responseHeaders: {},
    responseBody: undefined,
    responseStatusCode: 200,
    providerId: deployment.defaultProviderId,
  };

  // Execute the deployment and get the response
  const { providerResponse } = await executeDeploymentForHttp(
    deployment,
    requestContext
  );

  // Send the response to the client
  Object.entries(providerResponse.headers).forEach(([key, value]) => {
    res.set(key, value);
  });
  res.status(providerResponse.statusCode);
  res.send(providerResponse.body);
}
