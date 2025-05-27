import type { GenerateTextResult } from 'ai';
import type { Response } from 'express';
import type { OpenAIChatCompletionResponse } from './types/openai.js';

export function handleAiSdkTextResponse(
  model: string,
  expressResponse: Response,
  aiResponse: GenerateTextResult<never, never>
) {
  // Transform the response to match OpenAI's format
  const openAIResponse: OpenAIChatCompletionResponse = {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: aiResponse.text,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: aiResponse.usage.promptTokens,
      completion_tokens: aiResponse.usage.completionTokens,
      total_tokens: aiResponse.usage.totalTokens,
    },
  };

  expressResponse.json(openAIResponse);
}
