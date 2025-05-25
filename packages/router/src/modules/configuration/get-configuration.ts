export type Configuration = {
  multiTenant: boolean;
  devMode: boolean;
  authentication:
    | {
        type: 'none';
      }
    | { type: 'credentials' };
  dbConnectionString: string;
};

let configuration: Configuration | null = null;

export function getConfiguration(): Configuration {
  if (!configuration) {
    throw new Error('Configuration not loaded');
  }
  return configuration;
}

export function setConfiguration(providedConfiguration: Configuration) {
  configuration = providedConfiguration;
}
