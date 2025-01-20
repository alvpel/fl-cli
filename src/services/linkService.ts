import { kv } from "../config/kvConfig.ts";
import { Link } from "../types/linkTypes.ts";
import { openUrl } from "../utils/urlUtils.ts";


export async function resolveLink(
  linkName: string,
  openFn: (url: string) => Promise<void> = openUrl,
) {
  const [shortcut, variable] = linkName.split("/", 2);
  const linkKey = ["links", shortcut];
  const result = await kv.get<Link>(linkKey);

  if (result.value) {
    let url: string = result.value.baseUrl;

    if (variable && result.value.variablePattern) {
      url = result.value.variablePattern.replace(
        "{*}",
        encodeURIComponent(variable),
      );
    }

    await openFn(url);
  } else {
    console.log(`No fast link found for "${linkName}"`);
  }
}

export async function listLinks() {
  console.log(`# Available Links\n`);

  for await (const entry of kv.list<Link>({ prefix: ["links"] })) {
    const name = entry.key[1];
    const config = entry.value;

    console.log(`### ${String(name)}`);
    console.log(`- **Base URL**: ${config.baseUrl}`);
    if (config.variablePattern) {
      console.log(`- **Variable Pattern**: ${config.variablePattern}`);
    }
    console.log(""); // Blank line for spacing
  }
}

export async function shortlistLinks() {
  console.log(`# Link Names\n`);

  for await (const entry of kv.list<Link>({ prefix: ["links"] })) {
    const name = entry.key[1];
    console.log(`- **${String(name)}**`);
  }
}

export async function addLink(
  name: string,
  url: string,
  variablePattern?: string
) {
  const linkKey = ["links", name];
  const existingLink = await kv.get<Link>(linkKey);

  if (existingLink.value) {
    console.error(`FL "${name}" already exists. use --replace to replace it.`);
    return;
  }

  const newLink: Link = {
    baseUrl: url,
    variablePattern: variablePattern || undefined,
    createdAt: new Date(),
  };

  await kv.set(linkKey, newLink);
  console.log(`FL "${name}" added.`);
}

export async function replaceLink(
  oldName: string,
  newName: string,
  newUrl: string,
  newVariablePattern?: string,
) {
  const oldLinkKey = ["links", oldName];
  const existingLink = await kv.get<Link>(oldLinkKey);

  if (!existingLink.value) {
    console.error(`FL "${oldName}" does not exist.`);
    return;
  }

  const newLink: Link = {
    baseUrl: newUrl,
    variablePattern: newVariablePattern || undefined,
    createdAt: new Date(),
  };

  await kv.delete(oldLinkKey);
  await kv.set(["links", newName], newLink);
  console.log(
    `FL "${oldName}" has been updated to "${newName}" with URL "${newUrl}"`,
  );
}

export async function editLink(
  name: string,
  field: string,
  value: string,
) {
  const linkKey = ["links", name];
  const existingLink = await kv.get<Link>(linkKey);

  if (!existingLink.value) {
    console.error(`FL "${name}" does not exist.`);
    return;
  }

  if (!["--name", "-n", "--link", "-l", "--vlink", "-vl"].includes(field)) {
    console.error("Invalid field, use --name, --link or --vlink");
    return;
  }

  switch (field) {
    case "--name":
    // deno-lint-ignore no-case-declarations
    case "-n":
      const newLinkKey = ["links", value];
      await kv.set(newLinkKey, existingLink.value);
      await kv.delete(linkKey);
      console.log(`FL "${name}" has been renamed to "${value}"`);
      break;
    case "--link":
    case "-l":
      existingLink.value.baseUrl = value;
      await kv.set(linkKey, existingLink.value);
      console.log(`FL "${name} URL updated to "${value}"`);
      break;
    case "--vlink":
    case "-vl":
      existingLink.value.variablePattern = value;
      await kv.set(linkKey, existingLink.value);
      console.log(`FL "${name} variable URL updated to "${value}"`);
      break;
  }
}

export async function deleteLink(name: string) {
  const linkKey = ["links", name];
  const result = await kv.get<Link>(linkKey);

  if (!result.value) {
    console.error(`FL "${name}" does not exist`);
    return;
  }
  await kv.delete(linkKey);
  console.log(`FL "${name}" has been deleted`);
}
