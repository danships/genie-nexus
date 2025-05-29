import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { OpenAIChatCompletionRequest } from '../../chat-completions/types/openai.js';

import type { GenerateTextResult } from 'ai';
import { generateText, streamText } from 'ai';
import { openAiToAiSdkRequestMapper } from '../utils/openai-to-ai-sdk-request-mapper.js';

type GoogleProviderConfig = {
  apiKey: string;
};

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: GoogleProviderConfig
): Promise<GenerateTextResult<{}, unknown>> {
  try {
    const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
    const model = google(request.model);

    return await generateText({
      model,
      messages: request.messages,
      ...openAiToAiSdkRequestMapper(request),
    });
  } catch (error) {
    throw new Error(
      `Google AI completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: GoogleProviderConfig
) {
  try {
    const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
    const model = google(request.model);

    return streamText({
      model,
      messages: request.messages,
      ...openAiToAiSdkRequestMapper(request),
    });
  } catch (error) {
    throw new Error(
      `Google AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
