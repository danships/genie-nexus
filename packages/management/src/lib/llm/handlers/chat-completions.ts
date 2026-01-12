import type { ApiKey } from "@genie-nexus/database";
import type { DeploymentLLMApi, LlmRequestContext } from "@genie-nexus/types";
import { isLlmApiKey } from "@genie-nexus/types";
import { executeLlm } from "../execute-llm";
import { getDeploymentBySlug } from "../get-deployment-by-slug";
import {
  createChatCompletion as googleCreateChatCompletion,
  createStreamingChatCompletion as googleCreateStreamingChatCompletion,
} from "../providers/google";
import {
  createChatCompletion as openAICreateChatCompletion,
  createStreamingChatCompletion as openAICreateStreamingChatCompletion,
} from "../providers/openai";
import {
  createChatCompletion as staticCreateChatCompletion,
  createStreamingChatCompletion as staticCreateStreamingChatCompletion,
} from "../providers/static";
import {
  createOpenAIStreamFromAiSdk,
  createOpenAIStreamFromStatic,
} from "../stream-response";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { NextResponse } from "next/server";

type HandleChatCompletionParams = {
  apiKey: ApiKey;
  tenantId: string;
  deploymentSlug: string;
  body: OpenAIChatCompletionRequest;
};

export async function handleChatCompletion({
  apiKey,
  tenantId,
  deploymentSlug,
  body,
}: HandleChatCompletionParams): Promise<Response> {
  if (!body.messages || !Array.isArray(body.messages)) {
    return NextResponse.json(
      {
        error: {
          message: "messages is required and must be an array",
          type: "invalid_request_error",
        },
      },
      { status: 400 }
    );
  }

  const deployment = await getDeploymentBySlug(tenantId, deploymentSlug, "llm");

  if (
    !isLlmApiKey(apiKey) ||
    (Array.isArray(apiKey.allowedDeployments) &&
      !apiKey.allowedDeployments.includes(deployment.id)) ||
    deployment.type !== "llm"
  ) {
    return NextResponse.json(
      {
        error: {
          message: "model is not allowed for api key",
          type: "invalid_request_error",
        },
      },
      { status: 400 }
    );
  }

  const context: LlmRequestContext = {
    model: body.model,
    providerId: (deployment as DeploymentLLMApi).defaultProviderId,
    systemPrompt: body.messages.filter((m) => m.role === "system")[0]?.content,
    prompt: body.messages.filter((m) => m.role === "user")?.pop()?.content,
    responseMessage: "",
  };
  if (body.user) {
    context.user = body.user;
  }

  const { transformedRequest, provider } = await executeLlm(
    deployment as DeploymentLLMApi & { tenantId: string },
    context,
    body
  );

  const isStreaming = Boolean(body.stream);

  if (isStreaming) {
    let streamGenerator: AsyncGenerator<string>;

    switch (provider.type) {
      case "openai": {
        const aiResponse = openAICreateStreamingChatCompletion(
          transformedRequest,
          provider.baseURL,
          provider.apiKey
        );
        streamGenerator = createOpenAIStreamFromAiSdk(body.model, aiResponse);
        break;
      }
      case "google": {
        const aiResponse = googleCreateStreamingChatCompletion(
          transformedRequest,
          { apiKey: provider.apiKey }
        );
        streamGenerator = createOpenAIStreamFromAiSdk(body.model, aiResponse);
        break;
      }
      case "static": {
        const { id, text } =
          staticCreateStreamingChatCompletion(transformedRequest);
        streamGenerator = createOpenAIStreamFromStatic(body.model, id, text);
        break;
      }
      default: {
        throw new Error(`Unsupported LLM provider type ${provider.type}`);
      }
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of streamGenerator) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  switch (provider.type) {
    case "openai": {
      const response = await openAICreateChatCompletion(
        transformedRequest,
        provider.baseURL,
        provider.apiKey
      );

      const openAIResponse: OpenAIChatCompletionResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: body.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: response.text,
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: response.usage.promptTokens,
          completion_tokens: response.usage.completionTokens,
          total_tokens: response.usage.totalTokens,
        },
      };
      return NextResponse.json(openAIResponse);
    }
    case "google": {
      const response = await googleCreateChatCompletion(transformedRequest, {
        apiKey: provider.apiKey,
      });

      const openAIResponse: OpenAIChatCompletionResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: body.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: response.text,
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: response.usage.promptTokens,
          completion_tokens: response.usage.completionTokens,
          total_tokens: response.usage.totalTokens,
        },
      };
      return NextResponse.json(openAIResponse);
    }
    case "static": {
      const { text, usage } = staticCreateChatCompletion(transformedRequest);
      const staticResponse: OpenAIChatCompletionResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: transformedRequest.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: text,
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: usage.promptTokens,
          completion_tokens: usage.completionTokens,
          total_tokens: usage.totalTokens,
        },
      };
      return NextResponse.json(staticResponse);
    }
    default: {
      throw new Error(`Unsupported LLM provider type ${provider.type}`);
    }
  }
}
