import { assertEquals } from "jsr:@std/assert"
import { resolveLink } from "../src/services/linkService.ts";

Deno.test("resolveLink should return the correct URL", () => {
    const link = resolveLink("yt");
    assertEquals(link, "https://youtube.com/");
});