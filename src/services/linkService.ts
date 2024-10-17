import { readLinksConfig, writeLinksConfig, LinkConfig } from "../config/configService.ts";
import { joinPaths } from '../utils/pathUtils.ts';

const defaultConfigPath = joinPaths('.fl', 'links.json');

export function resolveLink(linkName: string, configPath: string = defaultConfigPath): string | null {
    const links = readLinksConfig(configPath);
    const [shortcut, variable] = linkName.split("/", 2);

    if (links[shortcut]) {
        const linkConfig = links[shortcut];

        if (variable && linkConfig.variablePattern) {
            return linkConfig.variablePattern.replace('{*}', encodeURIComponent(variable));
        }

        return linkConfig.baseUrl;
    }
    return null;
}

export function listLinks(configPath: string = defaultConfigPath) {
    const links = readLinksConfig(configPath);
    console.log('Available links:');
    for (const [name, config] of Object.entries(links)) {
        if (typeof config === 'object' && config !== null) {
            console.log(`${name}: ${config.baseUrl}`);
        }
        if (config.variablePattern) {
            console.log(`    - ${config.variablePattern}`);
        }
    }
}

export function shortlistLinks(configPath: string = defaultConfigPath) {
    const links = readLinksConfig(configPath);
    console.log('Link names:');
    for (const name of Object.keys(links)) {
        console.log(`- ${name}`);
    }
}

export async function addLink(name: string, url: string, variablePattern?: string, configPath: string = defaultConfigPath) {
    const links = readLinksConfig(configPath);
    if (links[name]) {
        console.error(`FL "${name}" already exists. use --replace to replace it.`);
        return;
    }

    const newLink: LinkConfig = {
        baseUrl: url,
        variablePattern: variablePattern || undefined
    };

    links[name] = newLink;
    await writeLinksConfig(links, configPath);
    console.log(`FL "${name}" added.`)
}

export async function replaceLink(oldName: string, newName: string, newUrl: string, newVariablePattern?: string, configPath: string = defaultConfigPath) {
    const links = readLinksConfig(configPath);
    if (!links[oldName]) {
        console.error(`FL "${oldName}" does not exist.`);
        return;
    }

    const newLink: LinkConfig = {
        baseUrl: newUrl,
        variablePattern: newVariablePattern || undefined
    };

    delete links[oldName];
    links[newName] = newLink;
    await writeLinksConfig(links, configPath);
    console.log(`FL "${oldName}" has been updated to "${newName}" with URL "${newUrl}"`);
}

export async function deleteLink(name: string, configPath: string = defaultConfigPath) {
    const links = readLinksConfig(configPath);
    if (!links[name]) {
        console.error(`FL "${name}" does not exist`);
        return;
    }
    delete links[name];
    await writeLinksConfig(links, configPath);
    console.log(`FL "${name}" has been deleted`);
}