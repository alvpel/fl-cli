import {
  LinkConfig,
  readLinksConfig,
  writeLinksConfig,
} from "../config/configService.ts";
import { joinPaths } from "../utils/pathUtils.ts";
import { openUrl } from "../utils/urlUtils.ts";

const defaultConfigPath = joinPaths(".fl", "links.json");

export async function resolveLink(
  linkName: string,
  configPath: string = defaultConfigPath,
  openFn: (url: string) => Promise<void> = openUrl,
) {
  const links = readLinksConfig(configPath);
  const [shortcut, variable] = linkName.split("/", 2);

  if (links[shortcut]) {
    const linkConfig = links[shortcut];
    let url: string = linkConfig.baseUrl;

    if (variable && linkConfig.variablePattern) {
      url = linkConfig.variablePattern.replace(
        "{*}",
        encodeURIComponent(variable),
      );
    }

    await openFn(url);
  } else {
    console.log(`No fast link found for "${linkName}"`);
  }
}

export function listLinks(configPath: string = defaultConfigPath) {
  const links = readLinksConfig(configPath);
  console.log(`# Available Links\n`);

  for (const [name, config] of Object.entries(links)) {
    if (typeof config === "object" && config !== null) {
      console.log(`### ${name}`);
      console.log(`- **Base URL**: ${config.baseUrl}`);
    }
    if (config.variablePattern) {
      console.log(`- **Variable Pattern**: ${config.variablePattern}`);
    }
    console.log(""); // Blank line for spacing
  }
}

export function shortlistLinks(configPath: string = defaultConfigPath) {
  const links = readLinksConfig(configPath);
  console.log(`# Link Names\n`);

  for (const name of Object.keys(links)) {
    console.log(`- **${name}**`);
  }
}

export async function addLink(
  name: string,
  url: string,
  variablePattern?: string,
  configPath: string = defaultConfigPath,
) {
  const links = readLinksConfig(configPath);
  if (links[name]) {
    console.error(`FL "${name}" already exists. use --replace to replace it.`);
    return;
  }

  const newLink: LinkConfig = {
    baseUrl: url,
    variablePattern: variablePattern || undefined,
  };

  links[name] = newLink;
  await writeLinksConfig(links, configPath);
  console.log(`FL "${name}" added.`);
}

export async function replaceLink(
  oldName: string,
  newName: string,
  newUrl: string,
  newVariablePattern?: string,
  configPath: string = defaultConfigPath,
) {
  const links = readLinksConfig(configPath);
  if (!links[oldName]) {
    console.error(`FL "${oldName}" does not exist.`);
    return;
  }

  const newLink: LinkConfig = {
    baseUrl: newUrl,
    variablePattern: newVariablePattern || undefined,
  };

  delete links[oldName];
  links[newName] = newLink;
  await writeLinksConfig(links, configPath);
  console.log(
    `FL "${oldName}" has been updated to "${newName}" with URL "${newUrl}"`,
  );
}

export async function editLink(
  name: string,
  field: string,
  value: string,
  configPath: string = defaultConfigPath,
) {
  const links = readLinksConfig(configPath);

  if (!links[name]) {
    console.error(`FL "${name}" does not exist.`);
    return;
  }

  if (!["--name", "-n", "--link", "-l", "--vlink", "-vl"].includes(field)) {
    console.error("Invalid field, use --name, --link or --vlink");
    return;
  }

  switch (field) {
    case "--name":
    case "-n":
      links[value] = links[name];
      delete links[name];
      console.log(`FL "${name}" has been renamed to "${value}"`);
      break;
    case "--link":
    case "-l":
      links[name].baseUrl = value;
      console.log(`FL "${name} URL updated to "${value}"`);
      break;
    case "--vlink":
    case "-vl":
      links[name].variablePattern = value;
      console.log(`FL "${name} variable URL updated to "${value}"`);
      break;
  }

  await writeLinksConfig(links, configPath);
}

export async function deleteLink(
  name: string,
  configPath: string = defaultConfigPath,
) {
  const links = readLinksConfig(configPath);
  if (!links[name]) {
    console.error(`FL "${name}" does not exist`);
    return;
  }
  delete links[name];
  await writeLinksConfig(links, configPath);
  console.log(`FL "${name}" has been deleted`);
}
