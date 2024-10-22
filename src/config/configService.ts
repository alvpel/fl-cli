import { readFile, writeFile } from "../utils/fileUtils.ts";
import { joinPaths } from "../utils/pathUtils.ts";

const defaultConfigPath = joinPaths(".fl", "links.json");

export type LinkConfig = {
  baseUrl: string;
  variablePattern?: string;
};

type LinksConfig = Record<string, LinkConfig>;

export function initConfig(configPath: string = defaultConfigPath) {
  if (!readFile(configPath)) {
    writeFile(configPath, JSON.stringify({}, null, 2));
  }
}

export function readLinksConfig(
  configPath: string = defaultConfigPath,
): LinksConfig {
  const data = readFile(configPath);
  return data ? JSON.parse(data) : {};
}

export function writeLinksConfig(
  config: LinksConfig,
  configPath: string = defaultConfigPath,
) {
  writeFile(configPath, JSON.stringify(config, null, 2));
}
