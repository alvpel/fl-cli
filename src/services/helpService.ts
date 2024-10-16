import { commands } from "../commands/commandRegistry.ts";

export function help() {
    console.log('Usage: fl <fastlink>[/query]')
    console.log('Available commands:');
    commands.forEach((cmd) => {
        const flag = cmd.shorthand ? `${cmd.name} (${cmd.shorthand})` : cmd.name;
        console.log(`\n${flag}`);
        console.log(`    ${cmd.description}`);
        if (cmd.args.length > 0) {
            console.log(`    Arguments:`);
            cmd.args.forEach(arg => {
                console.log(`    - ${arg.name} (required: ${arg.required})`);
            });
        }
    });
}