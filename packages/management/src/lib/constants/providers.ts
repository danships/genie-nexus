export const PROVIDER_TYPES_TITLES: Record<string, string> = {
  openai: 'OpenAI Provider',
  static: 'Static Provider',
  'http-proxy': 'HTTP Proxy Provider',
  'http-static': 'HTTP Static Provider',
  google: 'Google AI Provider',
};

export const PROVIDER_TYPES_SUMMARY: Record<string, string> = {
  openai: 'Connect to OpenAI API for chat completions',
  static: 'Use static responses for testing',
  'http-proxy': 'Proxy requests to another HTTP endpoint',
  'http-static': 'Return static HTTP responses',
  google: 'Connect to Google AI (Gemini) for chat completions',
};
