export async function openUrl(url: string) {
    console.log(`Opening: ${url}`);
    const process = new Deno.Command('open', { args: [url] }).spawn();
    await process.status;
}