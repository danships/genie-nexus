import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { GenerateTextResult, StreamTextResult } from 'ai';
import { generateText, streamText } from 'ai';
import type { OpenAIChatCompletionRequest } from '../../chat-completions/types/openai.js';
import { openAiToAiSdkRequestMapper } from '../utils/openai-to-ai-sdk-request-mapper.js';

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  baseURL: string,
  apiKey: string
): Promise<GenerateTextResult<{}, unknown>> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await generateText({
      model: createOpenAICompatible({
        baseURL,
        name: 'OpenAI Compatible',
        apiKey,
      }).chatModel(request.model),
      messages: request.messages,
      ...openAiToAiSdkRequestMapper(request),
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
  baseURL: string,
  apiKey: string
): StreamTextResult<{}, unknown> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = streamText({
      model: createOpenAICompatible({
        baseURL,
        name: 'OpenAI Compatible',
        apiKey,
      }).chatModel(request.model),
      messages: request.messages,
      ...openAiToAiSdkRequestMapper(request),
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while calling OpenAI API');
  }
}
