import { join } from "jsr:@std/path"

export function readLinksConfig(): Record<string, string> {
    const configPath = join(Deno.cwd(), 'config', 'links.json');
    const configData = Deno.readTextFileSync(configPath);
    return JSON.parse(configData);
}