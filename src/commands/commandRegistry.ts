export interface Command {
    name: string;
    shorthand?: string;
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
        shorthand: '-l',
        description: 'List all available fast links.',
        args: [],
        usage: 'fl [--list, -l]',
    },
    {
        name: '--add',
        shorthand: '-a',
        description: 'Add a new fast link with name and URL, and optional variable pattern. Use {*} in the pattern to denote where the variable will be.',
        args: [
            { name: 'name', required: true },
            { name: 'url', required: true },
            { name: 'variablePattern', required: false }
        ],
        usage: 'fl [--add, -a] <name> \'<url>\' \'[variablePattern]\'',
    },
    {
        name: '--edit',
        shorthand: '-e',
        description: 'Edit an existing fast link with a new name and URL.',
        args: [
            { name: 'old-name', required: true },
            { name: 'new-name', required: true },
            { name: 'new-url', required: true },
            { name: 'new-variablePattern', required: false }
        ],
        usage: 'fl [--edit, -e] <old-name> <new-name> \'<new-url>\' \'<new-variablePattern>\'',
    },
    {
        name: '--delete',
        shorthand: '-d',
        description: 'Delete a fast link',
        args: [
            { name: 'name', required: true }
        ],
        usage: 'fl [--delete, -d] <name>',
    },
    {
        name: '--help',
        shorthand: '-h',
        description: 'Show application help and usage.',
        args: [],
        usage: 'fl [--help, -h]',
    },
];