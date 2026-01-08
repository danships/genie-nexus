import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["argon2", "sqlite3", "sqlite", "argon2"],
};

export default nextConfig;
