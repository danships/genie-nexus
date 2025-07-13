export type AuthMethod = "credentials" | "none";
export type DatabaseType = "sqlite" | "mysql";

export type TestConfig = {
  authMethod: AuthMethod;
  databaseType: DatabaseType;
  baseUrl: string;
};

export type AuthToken = string;
