// deno-lint-ignore-file no-case-declarations
import {
  addLink,
  deleteLink,
  editLink,
  listLinks,
  replaceLink,
  resolveLink,
  shortlistLinks,
} from "../services/linkService.ts";
import { help } from "../services/helpService.ts";
import { joinPaths } from "../utils/pathUtils.ts";

const defaultConfigPath = joinPaths(".fl", "links.json");

export async function handleFlCommand(
  command: string,
  args: string[],
  services = {
    listLinks,
    shortlistLinks,
    addLink,
    replaceLink,
    editLink,
    deleteLink,
    resolveLink,
    help,
  },
  configPath: string = defaultConfigPath,
) {
  switch (command) {
    case "--list":
    case "-l":
      services.listLinks(configPath);
      break;
    case "--shortlist":
    case "-sl":
      services.shortlistLinks(configPath);
      break;
    case "--add":
    case "-a":
      const [name, url, variablePattern] = args;
      await services.addLink(name, url, variablePattern, configPath);
      break;
    case "--replace":
    case "-r":
      const [oldName, newName, newUrl, newVariablePattern] = args;
      await services.replaceLink(
        oldName,
        newName,
        newUrl,
        newVariablePattern,
        configPath,
      );
      break;
    case "--edit":
    case "-e":
      const [eName, field, value] = args;
      await services.editLink(eName, field, value, configPath);
      break;
    case "--delete":
    case "-d":
      await services.deleteLink(args[0], configPath);
      break;
    case "--help":
    case "-h":
      services.help();
      break;
    default:
      await services.resolveLink(command, configPath);
      break;
  }
}
