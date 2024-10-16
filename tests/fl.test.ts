import { assertEquals, assertExists } from "jsr:@std/assert";
import { addLink, editLink, deleteLink, resolveLink } from "../src/services/linkService.ts";
import { writeLinksConfig, readLinksConfig } from "../src/config/configService.ts";
import { join } from "jsr:@std/path";

// Use a temporary file for testing
const tempConfigPath = join(Deno.cwd(), 'config', 'links.test.json');

// Mock data for testing
const mockLinks = {
  dashboard: { baseUrl: "https://dashboard.com" },
  g: { baseUrl: "http://www.google.com", variablePattern: "https://www.google.com/search?q={*}" }
};

// Helper to reset the mock configuration before each test
async function resetMockConfig() {
  await writeLinksConfig(mockLinks);
}

// Test setup
Deno.test({
  name: "Setup mock configuration",
  async fn() {
    await resetMockConfig();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// Test: Add Link with Variable Pattern
Deno.test("Add Link: Adds a new link with a variable pattern successfully", async () => {
  await resetMockConfig();
  await addLink("bing", "https://www.bing.com", "https://www.bing.com/search?q={*}");
  const links = readLinksConfig();
  assertExists(links["bing"]);
  assertEquals(links["bing"].baseUrl, "https://www.bing.com");
  assertEquals(links["bing"].variablePattern, "https://www.bing.com/search?q={*}");
});

// Test: Edit Link with Variable Pattern
Deno.test("Edit Link: Edits an existing link to include a variable pattern", async () => {
  await resetMockConfig();
  await editLink("dashboard", "dashboard", "https://dashboard-updated.com", "https://dashboard-updated.com/page?q={*}", tempConfigPath);
  const links = readLinksConfig();
  assertExists(links["dashboard"]);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard-updated.com");
  assertEquals(links["dashboard"].variablePattern, "https://dashboard-updated.com/page?q={*}");
});

// Test: Resolve Link with Variable
Deno.test("Resolve Link: Resolves a link with a variable correctly", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("g/test");
  assertEquals(resolvedLink, "https://www.google.com/search?q=test");
});

// Test: Resolve Link without Variable
Deno.test("Resolve Link: Resolves a link without a variable correctly", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("g");
  assertEquals(resolvedLink, "http://www.google.com");
});

// Test: Resolve Non-Existent Link
Deno.test("Resolve Link: Returns null for a non-existent link", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("nonexistent");
  assertEquals(resolvedLink, null);
});

// Test: Delete Link with Variable Pattern
Deno.test("Delete Link: Deletes a link with a variable pattern successfully", async () => {
  await resetMockConfig();
  await deleteLink("g", tempConfigPath);
  const links = readLinksConfig();
  assertEquals(links["g"], undefined);
});

// Test: List Links Including Variable Pattern
Deno.test("List Links: Lists all links including those with variable patterns", async () => {
  await resetMockConfig();
  const links = readLinksConfig();
  assertEquals(Object.keys(links).length, 2);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard.com");
  assertEquals(links["g"].baseUrl, "http://www.google.com");
  assertEquals(links["g"].variablePattern, "https://www.google.com/search?q={*}");
});
