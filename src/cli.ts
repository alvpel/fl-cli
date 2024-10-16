import { fl } from './commands/fl.ts';
import { help } from './commands/help.ts';

const command = Deno.args[0];
const args = Deno.args.slice(1);

switch (command) {
    case 'fl':
        fl(args);
        break;
    case 'help':
    default:
        help();
        break;
}