import type { Command } from "./commandRegistry.ts";

export function validateArgs(commandDef: Command, args: string[]): boolean {
  const requiredArgs = commandDef.args.filter((arg) => arg.required).length;
  if (args.length < requiredArgs || args.length > commandDef.args.length) {
    console.error(`Usage: ${commandDef.usage}`);
    return false;
  }
  return true;
}
