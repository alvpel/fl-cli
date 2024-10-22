import { commands } from "../commands/commandRegistry.ts";

export function help() {
  console.log(`# Fast Links CLI - Help`);
  console.log(`\n## Usage:`);
  console.log("```");
  console.log("fl <fastlink>[/query]");
  console.log("```");

  console.log(`\n## Available Commands:`);
  commands.forEach((cmd) => {
    const flag = cmd.shorthand ? `${cmd.name} (${cmd.shorthand})` : cmd.name;
    console.log(`\n##${flag}`);
    console.log(`${cmd.description}`);

    if (cmd.args.length > 0) {
      console.log(`\n#### Arguments:`);
      cmd.args.forEach((arg) => {
        console.log(`- **${arg.name}** (required: ${arg.required})`);
      });
    }
  });
}
