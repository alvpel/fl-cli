export interface Command {
    name: string;
    description: string;
    args: { name: string; required: boolean }[];
    usage: string;
}

export const commands: Command[] = [
    {
        name: '<name>',
        description: 'Open the link associated with the shortcut (e.g., fl yt). Supports variables (e.g. fl yt/veritasium',
        args: [
            { name: 'name', required: true },
        ],
        usage: 'fl <name>[/<variable>]'
    },
    {
        name: '--list',
        description: 'List all available fast links.',
        args: [],
        usage: 'fl --list',
    },
    {
        name: '--add',
        description: 'Add a new fast link with name and URL, and optional variable pattern. Use [var] in the pattern to denote where the variable will be.',
        args: [
            { name: 'name', required: true },
            { name: 'url', required: true },
            { name: 'variablePattern', required: false }
        ],
        usage: 'fl --add <name> \'<url>\' \'[variablePattern]\'',
    },
    {
        name: '--edit',
        description: 'Edit an existing fast link with a new name and URL.',
        args: [
            { name: 'old-name', required: true },
            { name: 'new-name', required: true },
            { name: 'new-url', required: true },
            { name: 'new-variablePattern', required: false }
        ],
        usage: 'fl --edit <old-name> <new-name> \'<new-url>\' \'<new-variablePattern>\'',
    },
    {
        name: '--delete',
        description: 'Delete a fast link',
        args: [
            { name: 'name', required: true }
        ],
        usage: 'fl --delete <name>',
    },
    {
        name: '--help',
        description: 'Show appliaction help and usage.',
        args: [],
        usage: 'fl --help',
    },
];