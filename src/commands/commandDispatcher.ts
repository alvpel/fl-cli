// deno-lint-ignore-file no-case-declarations
import { listLinks, addLink, replaceLink, editLink, deleteLink, resolveLink, shortlistLinks } from '../services/linkService.ts';
import { help } from "../services/helpService.ts";

export async function handleFlCommand(command: string, args: string[], services = {
    listLinks,
    shortlistLinks,
    addLink,
    replaceLink,
    editLink,
    deleteLink,
    resolveLink,
    help
}) {

    switch (command) {
        case '--list':
        case '-l':
            services.listLinks();
            break;
        case '--shortlist':
        case '-sl':
            services.shortlistLinks();
            break;
        case '--add':
        case '-a':
            const [name, url, variablePattern] = args;
            await services.addLink(name, url, variablePattern);
            break;
        case '--replace':
        case '-r':
            const [oldName, newName, newUrl, newVariablePattern] = args;
            await services.replaceLink(oldName, newName, newUrl, newVariablePattern);
            break;
        case '--edit':
        case '-e':
            const [eName, field, value] = args;
            await services.editLink(eName, field, value);
            break;
        case '--delete':
        case '-d':
            await services.deleteLink(args[0]);
            break;
        case '--help':
        case '-h':
            services.help();
            break;
        default:
            await services.resolveLink(command);
            break;
        
    }
}