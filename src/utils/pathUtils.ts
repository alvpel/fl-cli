import { join } from "jsr:@std/path";

export function joinPaths(...paths: string[]): string {
    const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
    if (!homeDir) throw new Error("HOME directory is not set.");
    return join(homeDir, ...paths);
}