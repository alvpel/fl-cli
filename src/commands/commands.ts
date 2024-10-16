export interface Command {
    name: string;
    description: string;
    args: { name: string; required: boolean }[];
    usage: string;
}

export const commands: Command[] = [
    {
        name: '<name>',
        description: 'Open the link associated with the shortcut (e.g., fl dashboard).',
        args: [
            { name: 'name', required: true },
        ],
        usage: 'fl <name>'
    },
    {
        name: '--list',
        description: 'List all available fast links.',
        args: [],
        usage: 'fl --list',
    },
    {
        name: '--add',
        description: 'Add a new fast link with name and URL',
        args: [
            { name: 'name', required: true },
            { name: 'url', required: true },
        ],
        usage: 'fl --add <name> <url>',
    },
    {
        name: '--edit',
        description: 'Edit an existing fast link with a new name and URL.',
        args: [
            { name: 'old-name', required: true },
            { name: 'new-name', required: true },
            { name: 'new-url', required: true },
        ],
        usage: 'fl --edit <old-name> <new-name> <new-url>',
    },
    {
        name: '--help',
        description: 'Show appliaction help and usage.',
        args: [],
        usage: 'fl --help',
    },
];