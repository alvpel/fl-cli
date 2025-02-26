export interface Command {
  name: string;
  shorthand?: string;
  description: string;
  args: { name: string; required: boolean }[];
  usage: string;
}

export const commands: Command[] = [
  {
    name: "<fastlink>",
    description:
      "Open the link associated with the shortcut (e.g., fl yt). Supports variables (e.g. fl yt/veritasium",
    args: [
      { name: "fastlink", required: true },
    ],
    usage: "fl <fastlink>[/<variable>]",
  },
  {
    name: "--list",
    shorthand: "-l",
    description: "List all available fast links.",
    args: [],
    usage: "fl [--list, -l]",
  },
  {
    name: "--shortlist",
    shorthand: "-sl",
    description: "Short list of fast links.",
    args: [],
    usage: "fl [--shortlist, -sl]",
  },
  {
    name: "--add",
    shorthand: "-a",
    description:
      "Add a new fast link with name and URL, and optional variable pattern. Use {*} in the pattern to denote where the variable will be.",
    args: [
      { name: "name", required: true },
      { name: "url", required: true },
      { name: "variablePattern", required: false },
    ],
    usage: "fl [--add, -a] <name> '<url>' '[variablePattern]'",
  },
  {
    name: "--replace",
    shorthand: "-r",
    description: "Replace an existing fast link with a new name and URL.",
    args: [
      { name: "old-name", required: true },
      { name: "new-name", required: true },
      { name: "new-url", required: true },
      { name: "new-variablePattern", required: false },
    ],
    usage:
      "fl [--replace, -r] <old-name> <new-name> '<new-url>' '<new-variablePattern>'",
  },
  {
    name: "--edit",
    shorthand: "-e",
    description: "Edit a field in an existing fast link.",
    args: [
      { name: "name", required: true },
      { name: "field", required: true },
      { name: "value", required: true },
    ],
    usage:
      "fl [--edit, -e] <name> [--name, -n; --link, -l; --vlink, -vl] <value>",
  },
  {
    name: "--delete",
    shorthand: "-d",
    description: "Delete a fast link",
    args: [
      { name: "name", required: true },
    ],
    usage: "fl [--delete, -d] <name>",
  },
  {
    name: "--help",
    shorthand: "-h",
    description: "Show application help and usage.",
    args: [],
    usage: "fl [--help, -h]",
  },
];
