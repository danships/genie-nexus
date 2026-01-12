import type { environment } from "@lib/environment";

export type Start = {
  type: "start";
  configuration: {
    authentication: typeof environment.AUTH_METHOD;
  };
};

export type Ping = {
  type: "ping";
  stats: {
    deployments: Record<string, number>;
    providers: Record<string, number>;
    users: number;
  };
};

export type Create = {
  type: "create";
  entity: string;
};

export type TelemetryDisabled = {
  type: "telemetry-disabled";
};

export type TelemetryEnabled = {
  type: "telemetry-enabled";
};

export type Registered = {
  type: "registered";
};

export type Events =
  | Start
  | Ping
  | Create
  | TelemetryDisabled
  | TelemetryEnabled
  | Registered;

export type TelemetryEvent = {
  version: 1;
  timestamp: string;
  os: {
    platform: string;
    release: string;
    arch: string;
    node: string;
  };
  software: {
    version: string;
    name: string;
    db: "sqlite" | "mysql";
    runtimeEnvironment: "cli" | "docker";
  };
  hash: string;
  details: Events;
};
