import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { OpenAIChatCompletionRequest } from '../../chat-completions/types/openai.js';

import type { GenerateTextResult } from 'ai';
import { generateText, streamText } from 'ai';

type GoogleProviderConfig = {
  apiKey: string;
};

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: GoogleProviderConfig
): Promise<GenerateTextResult<never, never>> {
  try {
    const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
    const model = google(request.model);

    return await generateText({ model, messages: request.messages });
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
    });
  } catch (error) {
    throw new Error(
      `Google AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
