import type { OpenAIChatCompletionRequest } from '../chat-completions/types/openai';
import type { Deployment, Provider } from '@genie-nexus/database';
import { getProviderRepository } from '../../core/db';

export async function executeForLlm(
  deployment: Deployment,
  request: OpenAIChatCompletionRequest,
): Promise<{
  transformedRequest: OpenAIChatCompletionRequest;
  provider: Provider;
}> {
  const providerRepository = await getProviderRepository();
  const provider = await providerRepository.getById(
    deployment.defaultProviderId,
  );

  if (!provider) {
    throw new Error('Provider not found');
  }

  return { transformedRequest: request, provider };
}

export async function executeForHttp(deployment: Deployment): Promise<{
  provider: Provider;
}> {
  const providerRepository = await getProviderRepository();
  const provider = await providerRepository.getById(
    deployment.defaultProviderId,
  );

  if (!provider) {
    throw new Error('Provider not found');
  }

  return { provider };
}
