import { commands } from "./commands.ts";

export function help() {
    console.log('Usage: fl <fastlink>[/query]')
    console.log('Available commands:');
    commands.forEach((cmd) => {
        console.log(`\n${cmd.usage}`);
        console.log(`    ${cmd.description}`);
        if (cmd.args.length > 0) {
            console.log(`    Arguments:`);
            cmd.args.forEach(arg => {
                console.log(`    - ${arg.name} (required: ${arg.required})`);
            });
        }
    });
}