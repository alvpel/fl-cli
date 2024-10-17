// deno-lint-ignore-file no-case-declarations
import { commands } from "./commandRegistry.ts";
import { listLinks, addLink, replaceLink, deleteLink, resolveLink, shortlistLinks } from '../services/linkService.ts';
import { help } from "../services/helpService.ts";

function getFullCommand(command: string): string | undefined {
    const foundCommand = commands.find(comd => comd.name === command || comd.shorthand === command);
    return foundCommand?.name;
}

export async function handleFlCommand(command: string, args: string[]) {
    const fullCommand = getFullCommand(command);

    if (!fullCommand) {
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

    const commandDef = commands.find(comd => comd.name === fullCommand);
    if (!commandDef) {
        help();
        return;
    }
    switch (fullCommand) {
        case '--list':
            listLinks();
            break;
        case '--shortlist':
            shortlistLinks();
            break;
        case '--add':
            const [name, url, variablePattern] = args;
            await addLink(name, url, variablePattern);
            break;
        case '--replace':
            const [oldName, newName, newUrl, newVariablePattern] = args;
            await replaceLink(oldName, newName, newUrl, newVariablePattern);
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