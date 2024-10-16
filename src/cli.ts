import { handleFlCommand } from './commands/fl.ts';

const [command, ...args] = Deno.args;

if (command !== 'fl') {
    console.error('Invalid command. Usage: fl <command> [options]');
    Deno.exit(1);
}

const subCommand = args[0];
const subArgs = args.slice(1);

handleFlCommand(subCommand, subArgs);