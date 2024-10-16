import { handleFlCommand } from './commands/commandDispatcher.ts';

const [command, ...args] = Deno.args;


handleFlCommand(command || '--help', args);