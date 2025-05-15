import type { Provider } from '@genie-nexus/database';

export const PROVIDER_TYPES_TITLES: Record<Provider['type'], string> = {
  openai: 'OpenAI compatible endpoint',
  static: 'Static LLM',
  'http-proxy': 'Weave HTTP Proxy',
  'http-static': 'Weave HTTP Static',
};

export const PROVIDER_TYPES_SUMMARY: Record<Provider['type'], string> = {
  openai:
    'An OpenAI API compatible endpoint that can be used to transparently connect to other LLM providers',
  static: 'Static LLM - Provider that returns static/hardcoded responses',
  'http-proxy':
    'Provider that forwards requests and optionally manipulates requests to another HTTP endpoint',
  'http-static':
    'Provider that returns static HTTP responses with configurable headers and body',
};
