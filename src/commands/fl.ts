import { listLinks, addLink, editLink, deleteLink, resolveLink } from '../services/linkService.ts';
import { help } from "./help.ts";

export async function handleFlCommand(command: string, args: string[]) {
    switch (command) {
        case '--list':
            listLinks()
            break;
        case '--add':
            if (args.length !== 2) {
                console.error('Usage: fl --add <name> <url>');
            } else {
                await addLink(args[0], args[1]);
            }
            break;
        case '--edit':
            if (args.length !== 3) {
                console.error('Usage: fl --edit <old-name> <new-name> <new-url>');
            } else {
                await editLink(args[0], args[1], args[2]);
            }
            break;
        case '--delete':
            if (args.length !== 1) {
                console.error('Usage: fl --delete <name>');
            } else {
                await deleteLink(args[0]);
            }
            break;
        case '--help':
            help();
            break;
        // deno-lint-ignore no-case-declarations
        default:
            if (!command) {
                help();
                break;
            }
            const resolvedUrl = resolveLink(command);

            if (resolvedUrl) {
                console.log(`Opening: ${resolvedUrl}`);
                const process = new Deno.Command('open', { args: [resolvedUrl] }).spawn();
                await process.status;
            } else {
                console.log(`No link found for "${command}"`);
            }
            break;
    }
}