import { readLinksConfig, writeLinksConfig } from '../utils/config.ts';

export function resolveLink(linkName: string, configPath?: string): string | null {
    const links = readLinksConfig(configPath);
    return links[linkName] || null;
}

export function listLinks(configPath?: string) {
    const links = readLinksConfig(configPath);
    console.log('Available links:');
    for (const [name, url] of Object.entries(links)) {
        console.log(`${name}: ${url}`);
    }
}

export async function addLink(name: string, url: string, configPath?: string) {
    const links = readLinksConfig(configPath);
    if (links[name]) {
        console.error(`FL "${name}" already exists. use --edit to modify it.`);
        return;
    }

    links[name] = url;
    await writeLinksConfig(links, configPath);
    console.log(`FL "${name}" added.`)
}

export async function editLink(oldName: string, newName: string, newUrl: string, configPath?: string) {
    const links = readLinksConfig(configPath);
    if (!links[oldName]) {
        console.error(`FL "${oldName}" does not exist.`);
        return;
    }

    delete links[oldName];
    links[newName] = newUrl;
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