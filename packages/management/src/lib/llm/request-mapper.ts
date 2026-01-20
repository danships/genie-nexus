import type { OpenAIChatCompletionRequest } from './types';

type MappedParams = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string | string[];
  presencePenalty?: number;
  frequencyPenalty?: number;
  logitBias?: Record<string, number>;
  user?: string;
};

export function openAiToAiSdkRequestMapper(
  request: OpenAIChatCompletionRequest
): MappedParams {
  const mappedParams: MappedParams = {};

  if (request.temperature !== undefined) {
    mappedParams['temperature'] = request.temperature;
  }
  if (request.max_tokens !== undefined) {
    mappedParams['maxTokens'] = request.max_tokens;
  }
  if (request.top_p !== undefined) {
    mappedParams['topP'] = request.top_p;
  }
  if (request.stop !== undefined) {
    mappedParams['stop'] = request.stop;
  }
  if (request.presence_penalty !== undefined) {
    mappedParams['presencePenalty'] = request.presence_penalty;
  }
  if (request.frequency_penalty !== undefined) {
    mappedParams['frequencyPenalty'] = request.frequency_penalty;
  }
  if (request.logit_bias !== undefined) {
    mappedParams['logitBias'] = request.logit_bias;
  }
  if (request.user !== undefined) {
    mappedParams['user'] = request.user;
  }

  return mappedParams;
}
