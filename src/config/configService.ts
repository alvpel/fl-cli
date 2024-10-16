import { readFile, writeFile } from '../utils/fileUtils.ts';
import { joinPaths } from '../utils/pathUtils.ts';

const configPath = joinPaths('.fl', 'links.json');

export type LinkConfig = {
    baseUrl: string;
    variablePattern?: string;
};

type LinksConfig = Record<string, LinkConfig>;

export function initConfig() {
    if (!readFile(configPath)) {
        writeFile(configPath, JSON.stringify({}, null, 2));
    }
}

export function readLinksConfig(): LinksConfig {
    const data = readFile(configPath);
    return data ? JSON.parse(data) : {};
}

export function writeLinksConfig(config: LinksConfig) {
    writeFile(configPath, JSON.stringify(config, null, 2));
}




