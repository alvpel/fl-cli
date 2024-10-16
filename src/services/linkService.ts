import { readLinksConfig, writeLinksConfig, LinkConfig } from '../utils/config.ts';

export function resolveLink(linkName: string, configPath?: string): string | null {
    const links = readLinksConfig(configPath);
    const [shortcut, variable] = linkName.split("/", 2);

    if (links[shortcut]) {
        const linkConfig = links[shortcut];

        if (variable && linkConfig.variablePattern) {
            return linkConfig.variablePattern.replace('[var]', encodeURIComponent(variable));
        }

        return linkConfig.baseUrl;
    }
    return null;
}

export function listLinks(configPath?: string) {
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

export async function addLink(name: string, url: string, variablePattern?: string, configPath?: string) {
    const links = readLinksConfig(configPath);
    if (links[name]) {
        console.error(`FL "${name}" already exists. use --edit to modify it.`);
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

export async function editLink(oldName: string, newName: string, newUrl: string, newVariablePattern?: string, configPath?: string) {
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

export async function deleteLink(name: string, configPath?: string) {
    const links = readLinksConfig(configPath);
    if (!links[name]) {
        console.error(`FL "${name}" does not exist`);
        return;
    }
    delete links[name];
    await writeLinksConfig(links, configPath);
    console.log(`FL "${name}" has been deleted`);
}