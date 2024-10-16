import { join } from "jsr:@std/path"

const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE"); // Support Windows
if (!homeDir) {
    throw new Error("Unable to determine the home directory. Please set the HOME or USERPROFILE environment variable.");
}
const configDir = join(homeDir, '.fl');
const defaultConfigPath = join(configDir, 'links.json');

// Ensure the directory exists
try {
    Deno.mkdirSync(configDir, { recursive: true });

    // Check if the file exists, if not, create it with an empty configuration
    try {
        Deno.statSync(defaultConfigPath);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
        Deno.writeTextFileSync(defaultConfigPath, JSON.stringify({}, null, 2));
        console.log(`Created a new configuration file at: ${defaultConfigPath}`);
        } else {
        throw error;
        }
    }

    } catch (error) {
    if (error instanceof Error) {
        console.error('Error setting up configuration directory or file:', error.message);
    }
}
export type LinkConfig = {
    baseUrl: string;
    variablePattern?: string;
};

type LinksConfig = Record<string, LinkConfig>;

export function readLinksConfig(configPath: string = defaultConfigPath): LinksConfig {
    try {
        const configData = Deno.readTextFileSync(configPath);
        return JSON.parse(configData);
    } catch (error) {
        console.error('Failed to read configuration file:', error);
        return {};
    }
}

export async function writeLinksConfig(links: LinksConfig, configPath: string = defaultConfigPath) {
    try {
        await Deno.writeTextFile(configPath, JSON.stringify(links, null, 2));
    } catch (error) {
        console.error('Failed to write configuariton file:', error);
    }
}