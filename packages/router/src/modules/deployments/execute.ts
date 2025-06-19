import type { Deployment, Provider } from '@genie-nexus/database';
import { getProviderRepository } from '../../core/db/index.js';
import type { OpenAIChatCompletionRequest } from '../chat-completions/types/openai.js';

export async function executeForLlm(
  deployment: Deployment,
  request: OpenAIChatCompletionRequest
): Promise<{
  transformedRequest: OpenAIChatCompletionRequest;
  provider: Provider;
}> {
  const providerRepository = await getProviderRepository();
  const provider = await providerRepository.getById(
    deployment.defaultProviderId
  );

  if (!provider) {
    throw new Error('Provider not found');
  }

  if (deployment.type !== 'llm') {
    throw new Error('Deployment is not a llm deployment');
  }

  return {
    transformedRequest: { ...request, model: deployment.model },
    provider,
  };
}
