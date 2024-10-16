import { resolveLink } from '../services/linkService.ts';

export async function fl(args: string[]) {
    if (args.length === 0) {
        console.log('Usage: fl <link-name>');
        return;
    }

    const linkName = args[0];
    const resolvedUrl = resolveLink(linkName);

    if (resolvedUrl) {
        console.log(`Opening: ${resolvedUrl}`);
        const command = new Deno.Command('open', {
            args: [resolvedUrl],
        });

        const process = command.spawn();
        const status = await process.status;

        if (status.success) {
            console.log("Fast Link opened sucessfully");
        } else {
            console.log("Failed to open the link.")
        }
    } else {
        console.log(`No link found for "${linkName}"`);
    }
}