import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { GenerateTextResult, StreamTextResult } from 'ai';
import { generateText, streamText } from 'ai';
import type { OpenAIChatCompletionRequest } from '../../chat-completions/types/openai.js';

// TODO: Make this configurable
const ENDPOINT = 'https://openrouter.ai/api/v1';

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  apiKey: string,
): Promise<GenerateTextResult<never, never>> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await generateText({
      model: createOpenAICompatible({
        baseURL: ENDPOINT,
        name: 'Ollama',
        apiKey,
      }).chatModel(request.model),
      messages: request.messages,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while calling OpenAI API');
  }
}

export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest,
  apiKey: string,
): StreamTextResult<never, never> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = streamText({
      model: createOpenAICompatible({
        baseURL: ENDPOINT,
        name: 'Ollama',
        apiKey,
      }).chatModel(request.model),
      messages: request.messages,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while calling OpenAI API');
  }
}
