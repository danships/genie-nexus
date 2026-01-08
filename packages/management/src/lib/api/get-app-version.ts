import "server-only";
import { readFile } from "node:fs/promises";

let cachedVersion: string | undefined;

export async function getAppVersion(): Promise<string> {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const packagePath = new URL("../../../package.json", import.meta.url);
    const packageContent = await readFile(packagePath, "utf-8");
    const packageJson = JSON.parse(packageContent);
    const version: string = packageJson.version ?? "unknown";
    cachedVersion = version;
    return version;
  } catch {
    return "unknown";
  }
}
