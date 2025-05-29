export type ProviderResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: Buffer;
};
