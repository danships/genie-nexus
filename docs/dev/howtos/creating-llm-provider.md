# Creating a New LLM Provider

This guide explains how to create a new LLM (Large Language Model) provider for the Genie Nexus Router. The goal is to create an implementation that abstracts the
provider's API and provides a consistent interface for the router to use.

The implementation is three parts:

1. The types in the types package
2. The llm-provider in the router package
3. The UI in the management package.

All three parts are required to create a new provider.

## 1. Provider Structure

Each provider should be implemented in its own directory under `packages/router/src/modules/llm-providers/`. The structure should include:

```
llm-providers/
└── your-provider/
    ├── proxy.ts      # Main implementation
    ├── types.ts      # Provider-specific types
```

## 2. Implementation Requirements

Your provider must implement two main functions in `proxy.ts`. We use the `ai` SDK for consistent types and functionality:

```typescript
import { generateText, streamText } from 'ai';
import type { GenerateTextResult } from 'ai';
import { createYourProvider } from '@ai-sdk/your-provider';
```

### 2.1 Non-streaming Completion

```typescript
export async function createChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: YourProviderConfig,
): Promise<GenerateTextResult<never, never>> {
  try {
    const yourProvider = createYourProvider({ apiKey: config.apiKey });
    const model = yourProvider(request.model);

    return await generateText({ model, messages: request.messages });
  } catch (error) {
    throw new Error(
      `Provider completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
```

### 2.2 Streaming Completion

```typescript
export function createStreamingChatCompletion(
  request: OpenAIChatCompletionRequest,
  config: YourProviderConfig,
) {
  try {
    const yourProvider = createYourProvider({ apiKey: config.apiKey });
    const model = yourProvider(request.model);

    return streamText({ model, messages: request.messages });
  } catch (error) {
    throw new Error(
      `Provider streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
```

## 3. Provider Types

To integrate your provider with the system, you need to define its schemas in both API and database types.

### 3.1 API Types (`packages/types/src/schemas/api.ts`)

```typescript
// Base provider schema
const baseProviderSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().datetime().optional(),
});

// Your provider schema
export const yourProviderSchemaApi = baseProviderSchema.extend({
  type: z.literal('your-provider-type'),
  // Required fields
  apiKey: z.string(),
  // Optional fields with defaults
  model: z.string().default('default-model-name'),
  // Other configuration options
  options: z
    .object({
      // Add provider-specific options
    })
    .optional(),
});

// Add to the provider union
export const providerSchemaApi = z.discriminatedUnion('type', [
  // ... existing providers
  yourProviderSchemaApi,
]);
```

### 3.2 Database Types (`packages/types/src/schemas/db.ts`)

```typescript
// Base entity schema with id
const baseEntitySchema = z.object({
  id: z.string(),
});

// Schema with tenant ID
const entityWithTenantIdSchema = baseEntitySchema.extend({
  tenantId: z.string(),
});

// Your provider schema with database fields
export const yourProviderSchema = apiSchemas.yourProviderSchemaApi.and(
  entityWithTenantIdSchema,
);

// Add to the provider union
export const providerSchema = apiSchemas.providerSchemaApi.and(
  entityWithTenantIdSchema,
);
```

## 4. Provider Management UI

The provider management UI is implemented in `packages/management/src/app/app/providers/`. You need to implement several components:

### 4.1 Provider List (`_page.tsx`)

Add your provider to the filter options and display its details:

```typescript
<Select
  label="Filter by Type"
  data={[
    { value: 'openai', label: 'OpenAI' },
    { value: 'static', label: 'Static' },
    { value: 'your-provider', label: 'Your Provider' },
  ]}
/>

// In the table details column
<Table.Td>
  <Group gap="xs">
    <Badge variant="light" color="blue">
      {provider.type}
    </Badge>
    {provider.type === 'your-provider' && provider.apiKey && (
      <Badge variant="light" color="orange">
        API Key Set
      </Badge>
    )}
    {provider.type === 'your-provider' && provider.model && (
      <Text size="sm" c="dimmed">
        Model: {provider.model}
      </Text>
    )}
  </Group>
</Table.Td>
```

### 4.2 Provider Creation (`new/_page.tsx`)

Add your provider to the creation form:

```typescript
case 'your-provider':
  const yourProvider: YourProviderApi = {
    type: 'your-provider',
    name: values.name,
    apiKey: '',
    model: 'default-model-name',
  };
  const createResponse = await post<{ data: Provider }, YourProviderApi>(
    ENDPOINT_PROVIDERS_OVERVIEW,
    yourProvider,
  );
  createdProvider = createResponse.data;
  break;
```

### 4.3 Provider Edit Form

Create a new form component for your provider:

```typescript
// src/lib/components/molecules/provider-your-form.tsx
import { YourProvider } from '@genie-nexus/types';
import { TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

type Properties = {
  provider: YourProvider;
  submit: (values: { apiKey: string; model: string }) => Promise<void>;
};

export function ProviderYourForm({ provider, submit }: Properties) {
  const form = useForm({
    initialValues: {
      apiKey: provider.apiKey ?? '',
      model: provider.model ?? 'default-model-name',
    },
  });

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack>
        <TextInput
          label="API Key"
          placeholder="Enter your API key"
          {...form.getInputProps('apiKey')}
        />
        <TextInput
          label="Model"
          placeholder="Enter the model name"
          description="Default: default-model-name"
          {...form.getInputProps('model')}
        />
        <Button type="submit" variant="light">
          Save
        </Button>
      </Stack>
    </form>
  );
}
```

### 4.4 Provider Detail Page (`[id]/_page.tsx`)

Add your provider's edit form to the detail page:

```typescript
const TAB_YOUR_PROVIDER = 'your-provider';

// Add to the tabs list
{provider.type === 'your-provider' && (
  <Tabs.Tab value={TAB_YOUR_PROVIDER}>Your Provider Details</Tabs.Tab>
)}

// Add the form panel
<Tabs.Panel value={TAB_YOUR_PROVIDER}>
  <Text>Configure the API details for this provider.</Text>
  <hr />
  {provider.type === 'your-provider' && (
    <ProviderYourForm
      provider={provider}
      submit={handleYourProviderSubmit}
    />
  )}
</Tabs.Panel>
```

### 4.5 Provider Constants

Add your provider to the constants:

```typescript
// src/lib/constants/providers.ts
export const PROVIDER_TYPES_TITLES: Record<string, string> = {
  // ... existing providers
  'your-provider': 'Your Provider',
};

export const PROVIDER_TYPES_SUMMARY: Record<string, string> = {
  // ... existing providers
  'your-provider': 'Connect to Your Provider API for chat completions',
};
```

## 5. Key Points to Remember

1. **Error Handling**:

   - Implement proper error handling for API calls
   - Use try-catch blocks in both streaming and non-streaming functions
   - Provide meaningful error messages

2. **Type Safety**:

   - Use the AI SDK's types for consistent interfaces
   - Define all provider-specific types
   - Use proper type guards and null checks
   - Handle optional fields with default values

3. **Streaming Format**:

   - Use the AI SDK's streaming functionality
   - Ensure streaming responses follow the expected format
   - Handle chunk validation and error cases
   - Implement proper stream cleanup

4. **Usage Tracking**:

   - The AI SDK handles usage tracking automatically
   - Handle cases where usage data is not available
   - Provide default values for usage metrics

5. **API Key Management**:

   - Handle API key requirements appropriately
   - Implement secure storage and transmission
   - Clear API keys from UI state after use

6. **Provider Integration**:

   - Ensure your provider works with the provider system
   - Handle request/response transformations
   - Implement proper configuration validation

7. **UI Integration**:
   - Add all necessary UI components
   - Implement proper form validation
   - Handle loading and error states
   - Provide meaningful feedback to users

## 6. Testing

Make sure to test:

- Regular completion responses
- Streaming responses
- Error cases and error handling
- API key validation and management
- Request transformation
- Provider creation and management
- UI integration and form validation
- Type safety and null checks
- Default values and optional fields
- Loading and error states
