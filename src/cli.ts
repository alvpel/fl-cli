import { handleFlCommand } from './commands/fl.ts';

const [command, ...args] = Deno.args;


handleFlCommand(command || '--help', args);