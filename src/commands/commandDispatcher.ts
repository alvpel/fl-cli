// deno-lint-ignore-file no-case-declarations
import { listLinks, addLink, replaceLink, editLink, deleteLink, resolveLink, shortlistLinks } from '../services/linkService.ts';
import { help } from "../services/helpService.ts";

export async function handleFlCommand(command: string, args: string[]) {

    switch (command) {
        case '--list':
        case '-l':
            listLinks();
            break;
        case '--shortlist':
        case '-sl':
            shortlistLinks();
            break;
        case '--add':
        case '-a':
            const [name, url, variablePattern] = args;
            await addLink(name, url, variablePattern);
            break;
        case '--replace':
        case '-r':
            const [oldName, newName, newUrl, newVariablePattern] = args;
            await replaceLink(oldName, newName, newUrl, newVariablePattern);
            break;
        case '--edit':
        case '-e':
            const [eName, field, value] = args;
            if (!['--name', '-n', '--link', '-l', '--vlink', '-vl'].includes(field)) {
                console.error('Invalid field, use --name, --link or --vlink');
                return;
            }
            await editLink(eName, field, value);
            break;
        case '--delete':
        case '-d':
            await deleteLink(args[0]);
            break;
        case '--help':
        case '-h':
            help();
            break;
        default:
            const resolvedUrl = resolveLink(command);
            if (resolvedUrl) {
                console.log(`Opening: ${resolvedUrl}`);
                const process = new Deno.Command('open', { args: [resolvedUrl] }).spawn();
                await process.status;
            } else {
                console.log(`No fast link found for "${command}"`)
            }
            break;
        
    }
}