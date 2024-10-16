import { commands, Command } from "./commands.ts";
import { listLinks, addLink, editLink, deleteLink, resolveLink } from '../services/linkService.ts';
import { help } from "./help.ts";

export async function handleFlCommand(command: string, args: string[]) {
    const commandDef = commands.find(comd => comd.name === command);

    if (!commandDef) {
        // Assume it's a fast link if not a command
        const resolvedUrl = resolveLink(command);
        if (resolvedUrl) {
            console.log(`Opening: ${resolvedUrl}`);
            const process = new Deno.Command('open', { args: [resolvedUrl] }).spawn();
            await process.status;
        } else {
            console.log(`No fast link found for "${command}"`)
        }
        return;
    }

    // Validate arguments based on command defintion
    if (args.length !== commandDef.args.length) {
        console.error(`Usage: ${commandDef.usage}`);
        return;
    }

    switch (commandDef.name) {
        case '--list':
            listLinks()
            break;
        case '--add':
            await addLink(args[0], args[1]);
            break;
        case '--edit':
            await editLink(args[0], args[1], args[2]);
            break;
        case '--delete':
            await deleteLink(args[0]);
            break;
        case '--help':
            help();
            break;
        default:
            help();
            break;
        
    }
}