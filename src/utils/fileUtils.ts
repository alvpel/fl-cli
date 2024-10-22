export function readFile(path: string): string | null {
  try {
    return Deno.readTextFileSync(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

export function writeFile(path: string, data: string) {
  Deno.writeTextFileSync(path, data);
}
