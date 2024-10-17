import { assertEquals, assertExists } from "jsr:@std/assert";
import { addLink, replaceLink, editLink, deleteLink, resolveLink } from "../src/services/linkService.ts";
import { writeLinksConfig, readLinksConfig, initConfig } from "../src/config/configService.ts";
import { join } from "jsr:@std/path";

// Use a temporary file for testing
const testConfigPath = join(Deno.cwd(), 'tests', 'links.test.json');

// Mock data for testing
const mockLinks = {
  dashboard: { baseUrl: "https://dashboard.com" },
  g: { baseUrl: "https://www.google.com", variablePattern: "https://www.google.com/search?q={*}" }
};

// Helper to reset the mock configuration before each test
async function resetMockConfig() {
  await writeLinksConfig(mockLinks, testConfigPath);
}

initConfig(testConfigPath);

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
  await addLink("bing", "https://www.bing.com", "https://www.bing.com/search?q={*}", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertExists(links["bing"]);
  assertEquals(links["bing"].baseUrl, "https://www.bing.com");
  assertEquals(links["bing"].variablePattern, "https://www.bing.com/search?q={*}");
});

// Test: Replace Link with Variable Pattern
Deno.test("Replace Link: Replaces an existing link to include a variable pattern", async () => {
  await resetMockConfig();
  await replaceLink("dashboard", "dashboard", "https://dashboard-updated.com", "https://dashboard-updated.com/page?q={*}", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertExists(links["dashboard"]);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard-updated.com");
  assertEquals(links["dashboard"].variablePattern, "https://dashboard-updated.com/page?q={*}");
});

// Test: Edit Link Name
Deno.test("Edit Link: Changes the name of an existing link", async () => {
  await resetMockConfig();
  await editLink("g", "--name", "google", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertExists(links["google"]);
  assertEquals(links["google"].baseUrl, "https://www.google.com");
  assertEquals(links["g"], undefined);
});

// Test: Edit Link URL
Deno.test("Edit Link: Updates the URL of an existing link", async () => {
  await resetMockConfig();
  await editLink("g", "--link", "https://www.new-url.com", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertEquals(links["g"].baseUrl, "https://www.new-url.com");
});

// Test: Edit Link Variable Pattern
Deno.test("Edit Link: Updates the variable pattern of an existing link", async () => {
  await resetMockConfig();
  await editLink("g", "--vlink", "https://www.google.com/search?q={*}", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertEquals(links["g"].variablePattern, "https://www.google.com/search?q={*}");
});

// Test: Edit Link with Invalid Field
Deno.test("Edit Link: Fails when using an invalid field", async () => {
  await resetMockConfig();
  try {
      await editLink("google", "--invalid", "value", testConfigPath);
  } catch (e) {
      assertEquals(e as string, 'Invalid field. Use --name, --link, or --vlink.');
  }
});

// Test: Resolve Link with Variable
Deno.test("Resolve Link: Resolves a link with a variable correctly", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("g/test", testConfigPath);
  assertEquals(resolvedLink, "https://www.google.com/search?q=test");
});

// Test: Resolve Link without Variable
Deno.test("Resolve Link: Resolves a link without a variable correctly", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("g", testConfigPath);
  assertEquals(resolvedLink, "https://www.google.com");
});

// Test: Resolve Non-Existent Link
Deno.test("Resolve Link: Returns null for a non-existent link", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("nonexistent", testConfigPath);
  assertEquals(resolvedLink, null);
});

// Test: Delete Link with Variable Pattern
Deno.test("Delete Link: Deletes a link with a variable pattern successfully", async () => {
  await resetMockConfig();
  await deleteLink("g", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertEquals(links["g"], undefined);
});

// Test: List Links Including Variable Pattern
Deno.test("List Links: Lists all links including those with variable patterns", async () => {
  await resetMockConfig();
  const links = readLinksConfig(testConfigPath);
  assertEquals(Object.keys(links).length, 2);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard.com");
  assertEquals(links["g"].baseUrl, "https://www.google.com");
  assertEquals(links["g"].variablePattern, "https://www.google.com/search?q={*}");
});
