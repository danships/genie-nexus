import type { generateText, streamText } from "ai";
import type { OpenAIChatCompletionRequest } from "./types";

export function openAiToAiSdkRequestMapper(
  request: OpenAIChatCompletionRequest
):
  | Partial<Parameters<typeof generateText>[0]>
  | Partial<Parameters<typeof streamText>[0]> {
  // biome-ignore lint/suspicious/noExplicitAny: It's hard to have the correct type here
  const mappedParams: Record<string, any> = {};

  if (request.temperature !== undefined) {
    mappedParams["temperature"] = request.temperature;
  }
  if (request.max_tokens !== undefined) {
    mappedParams["maxTokens"] = request.max_tokens;
  }
  if (request.top_p !== undefined) {
    mappedParams["topP"] = request.top_p;
  }
  if (request.stop !== undefined) {
    mappedParams["stop"] = request.stop;
  }
  if (request.presence_penalty !== undefined) {
    mappedParams["presencePenalty"] = request.presence_penalty;
  }
  if (request.frequency_penalty !== undefined) {
    mappedParams["frequencyPenalty"] = request.frequency_penalty;
  }
  if (request.logit_bias !== undefined) {
    mappedParams["logitBias"] = request.logit_bias;
  }
  if (request.user !== undefined) {
    mappedParams["user"] = request.user;
  }

  return mappedParams;
}
