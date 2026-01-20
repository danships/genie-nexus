import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { LanguageModel } from 'ai';
import { generateText, streamText } from 'ai';
import { openAiToAiSdkRequestMapper } from '../request-mapper';
import type { OpenAIChatCompletionRequest } from '../types';

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  baseURL: string,
  apiKey: string
) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const model = createOpenAICompatible({
    baseURL,
    name: 'OpenAI Compatible',
    apiKey,
  }).chatModel(request.model) as unknown as LanguageModel;

  const response = await generateText({
    model,
    messages: request.messages,
    ...openAiToAiSdkRequestMapper(request),
  });

  return response;
}

export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest,
  baseURL: string,
  apiKey: string
) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const model = createOpenAICompatible({
    baseURL,
    name: 'OpenAI Compatible',
    apiKey,
  }).chatModel(request.model) as unknown as LanguageModel;

  const response = streamText({
    model,
    messages: request.messages,
    ...openAiToAiSdkRequestMapper(request),
  });

  return response;
}
