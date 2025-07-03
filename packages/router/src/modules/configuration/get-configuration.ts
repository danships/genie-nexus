export type Configuration = {
  multiTenant: boolean;
  devMode: boolean;
  authentication:
    | {
        type: 'none';
      }
    | { type: 'credentials' };
  telemetry: {
    websiteId: string;
    hostUrl: string;
  };
  runtimeEnvironment: 'cli' | 'docker';
  db: 'sqlite' | 'mysql';
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
