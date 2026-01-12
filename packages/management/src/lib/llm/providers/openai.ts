import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, streamText } from "ai";
import { openAiToAiSdkRequestMapper } from "../request-mapper";
import type { OpenAIChatCompletionRequest } from "../types";

export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  baseURL: string,
  apiKey: string
) {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }

  const response = await generateText({
    model: createOpenAICompatible({
      baseURL,
      name: "OpenAI Compatible",
      apiKey,
    }).chatModel(request.model),
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
    throw new Error("OpenAI API key is required");
  }

  const response = streamText({
    model: createOpenAICompatible({
      baseURL,
      name: "OpenAI Compatible",
      apiKey,
    }).chatModel(request.model),
    messages: request.messages,
    ...openAiToAiSdkRequestMapper(request),
  });

  return response;
}
