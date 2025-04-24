import type { OpenAIChatCompletionRequest } from '../chat-completions/types/openai';
import type { Deployment, Provider } from '../../core/db/types';
import { getProviderRepository } from '../../core/db';

export async function execute(
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
