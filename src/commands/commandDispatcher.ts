// deno-lint-ignore-file no-case-declarations
import { commands } from "./commandRegistry.ts";
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

    switch (commandDef.name) {
        case '--list':
            listLinks()
            break;
        case '--add':
            const [name, url, variablePattern] = args;
            await addLink(name, url, variablePattern);
            break;
        case '--edit':
            const [oldName, newName, newUrl, newVariablePattern] = args;
            await editLink(oldName, newName, newUrl, newVariablePattern);
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