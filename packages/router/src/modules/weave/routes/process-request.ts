import { TypeSymbols, inject, singleton } from '@genie-nexus/container';
import type { Logger } from '@genie-nexus/logger';
import type { WeaveRequestContext } from '@genie-nexus/types';
import type { Request, Response } from 'express';
import type { HttpRequestHandler } from '../../../core/http/get-handler-using-container.js';
import { checkApiKeyInRequest } from '../../api-key/check-api-key-in-request.js';
import { ApiKeyNotPresentError } from '../../api-key/errors/api-key-not-present-error.js';
import { ApiKeyValidationError } from '../../api-key/errors/api-key-validation-error.js';
import { ExecuteWeave } from '../../deployments/execute-weave.js';
import { getDeploymentBySlug } from '../../deployments/get-deployment-by-slug.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';
import type { ResponseLocalsTenant } from '../../tenants/middleware/types.js';

@singleton()
export class ProcessRequest implements HttpRequestHandler {
  constructor(
    @inject(TypeSymbols.LOGGER) private readonly logger: Logger,
    @inject(ExecuteWeave) private readonly execute: ExecuteWeave
  ) {}

  public async handle(
    req: Request<{
      path: string | string[];
      deploymentSlug: string;
    }>,
    res: Response<unknown, ResponseLocalsTenant>
  ) {
    const { deploymentSlug, path } = req.params;
    this.logger.debug('Starting weave request processing', {
      deploymentSlug,
      path,
    });
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
    const requestContext: WeaveRequestContext = {
      path: !flattenedPath.startsWith('/')
        ? `/${flattenedPath}`
        : flattenedPath,
      method: req.method,
      requestHeaders: Object.fromEntries(
        Object.entries(req.headers).flatMap(([k, v]) =>
          v === undefined
            ? []
            : Array.isArray(v)
              ? v.map((val) => [k, val])
              : [[k, v]]
        )
      ) as Record<string, string>,
      requestBody: req.body,
      responseHeaders: {},
      responseBody: undefined,
      responseStatusCode: 200,
      providerId: deployment.defaultProviderId,
    };

    this.logger.appendFixedMetadata({ deployment: deployment.id });
    // Execute the deployment and get the response
    const { providerResponse } = await this.execute.forHttp(
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
}
