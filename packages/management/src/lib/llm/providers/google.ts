import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { openAiToAiSdkRequestMapper } from '../request-mapper';
import type { OpenAIChatCompletionRequest } from '../types';

type GoogleProviderConfig = {
  apiKey: string;
};

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: GoogleProviderConfig
) {
  const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
  const model = google(request.model);

  return await generateText({
    model,
    messages: request.messages,
    ...openAiToAiSdkRequestMapper(request),
  });
}

export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: GoogleProviderConfig
) {
  const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
  const model = google(request.model);

  return streamText({
    model,
    messages: request.messages,
    ...openAiToAiSdkRequestMapper(request),
  });
}
