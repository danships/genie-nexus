import { Lifecycle, TypeSymbols, inject, scoped } from '@genie-nexus/container';
import type {
  Deployment,
  Provider,
  ProviderRepository,
  WeaveFlowRepository,
} from '@genie-nexus/database';
import type { WeaveRequestContext } from '@genie-nexus/types';
import { proxyRequest } from '../../weave-providers/http-proxy/proxy.js';
import { generateStaticResponse } from '../../weave-providers/static/generate-static-response.js';
import type { ProviderResponse } from '../../weave-providers/types.js';
import { ExecuteFlowEvent } from './flow/execute-flow-event.js';

@scoped(Lifecycle.ContainerScoped)
export class ExecuteWeave {
  constructor(
    @inject(TypeSymbols.PROVIDER_REPOSITORY)
    private readonly providerRepository: ProviderRepository,
    @inject(TypeSymbols.WEAVE_FLOW_REPOSITORY)
    private readonly flowRepository: WeaveFlowRepository,
    @inject(ExecuteFlowEvent)
    private readonly executeFlowEvent: ExecuteFlowEvent
  ) {}

  public async forHttp(
    deployment: Deployment,
    request: WeaveRequestContext
  ): Promise<{
    provider: Provider;
    transformedRequest: WeaveRequestContext;
    providerResponse: ProviderResponse;
  }> {
    // Get the flow for this deployment
    const flow = await this.flowRepository.getOneByQuery(
      this.flowRepository
        .createQuery()
        .eq('deploymentId', deployment.id)
        .eq('isDeleted', false)
    );

    // Execute the incoming request event if it exists
    const transformedRequest = flow
      ? await this.executeFlowEvent.executeForWeave(
          flow,
          'incomingRequest',
          request
        )
      : request;

    // Get the provider - either from the context or use the default
    const provider = await this.providerRepository.getById(
      transformedRequest.providerId
    );

    if (!provider || provider.tenantId !== deployment.tenantId) {
      throw new Error('Provider not found');
    }

    // Execute the provider to get the response
    let providerResponse: ProviderResponse;
    switch (provider.type) {
      case 'http-proxy': {
        providerResponse = await proxyRequest(
          provider,
          transformedRequest,
          transformedRequest.path
        );
        break;
      }
      case 'http-static': {
        providerResponse = generateStaticResponse(provider);
        break;
      }
      default: {
        throw new Error(`Unknown provider type ${provider.type}`);
      }
    }

    // Create a response context from the provider response
    const responseContext: WeaveRequestContext = {
      ...transformedRequest,
      responseHeaders: providerResponse.headers,
      responseBody: providerResponse.body,
      responseStatusCode: providerResponse.statusCode,
    };

    // Execute the response event if it exists
    const finalContext = flow
      ? await this.executeFlowEvent.executeForWeave(
          flow,
          'response',
          responseContext
        )
      : responseContext;

    return {
      provider,
      transformedRequest,
      providerResponse: {
        statusCode: finalContext.responseStatusCode,
        headers: finalContext.responseHeaders,
        body: finalContext.responseBody as Buffer,
      },
    };
  }
}
