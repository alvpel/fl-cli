import { readLinksConfig } from '../utils/config.ts';

export function resolveLink(linkName: string): string | null {
    const links = readLinksConfig();
    return links[linkName] || null;
}