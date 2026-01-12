import "server-only";
import { readFile } from "node:fs/promises";

type AppInfo = { name: string; version: string };

let cachedInfo: AppInfo | undefined;

export async function getAppVersion(): Promise<AppInfo> {
  if (cachedInfo) {
    return cachedInfo;
  }

  try {
    const packagePath = new URL("../../../package.json", import.meta.url);
    const packageContent = await readFile(packagePath, "utf-8");
    const packageJson = JSON.parse(packageContent);
    cachedInfo = {
      name: packageJson.name ?? "unknown",
      version: packageJson.version ?? "unknown",
    };
    return cachedInfo;
  } catch {
    return { name: "unknown", version: "unknown" };
  }
}
