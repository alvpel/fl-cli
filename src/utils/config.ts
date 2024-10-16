import { dirname, fromFileUrl, join } from "jsr:@std/path"

const __dirname = dirname(fromFileUrl(import.meta.url));
const configPath = join(__dirname, '..', '..', 'config', 'links.json');

export function readLinksConfig(): Record<string, string> {
    try {
        const configData = Deno.readTextFileSync(configPath);
        return JSON.parse(configData);
    } catch (error) {
        console.error('Failed to read configuration file:', error);
        return {};
    }
}

export async function writeLinksConfig(links: Record<string, string>) {
    try {
        await Deno.writeTextFile(configPath, JSON.stringify(links, null, 2));
    } catch (error) {
        console.error('Failed to write configuariton file:', error);
    }
}