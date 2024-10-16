import { join } from "jsr:@std/path";
import { assertEquals, assertExists } from "jsr:@std/assert"
import { addLink, editLink, deleteLink, resolveLink } from "../src/services/linkService.ts";
import { writeLinksConfig, readLinksConfig } from "../src/utils/config.ts";

const tempConfigPath = join(Deno.cwd(), 'config', 'links.test.json');

// Test setup: mock links.json location to avoid affecting the actual config
const mockLinks = {
  dashboard: "https://dashboard.com",
  docs: "https://docs.com"
};

// Helper to reset the mock configuration before each test
async function resetMockConfig() {
  await writeLinksConfig(mockLinks, tempConfigPath);
}

// Run before each test
Deno.test({
  name: "Setup mock configuration",
  async fn() {
    await resetMockConfig();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// Test: Add Link
Deno.test("Add Link: Adds a new link successfully", async () => {
  await resetMockConfig();
  await addLink("newLink", "https://newlink.com", tempConfigPath);
  const links = readLinksConfig(tempConfigPath);
  assertExists(links["newLink"]);
  assertEquals(links["newLink"], "https://newlink.com");
});

// Test: Edit Link
Deno.test("Edit Link: Edits an existing link successfully", async () => {
  await resetMockConfig();
  await editLink("dashboard", "newDashboard", "https://newdashboard.com", tempConfigPath);
  const links = readLinksConfig(tempConfigPath);
  assertExists(links["newDashboard"]);
  assertEquals(links["newDashboard"], "https://newdashboard.com");
  assertEquals(links["dashboard"], undefined);
});

// Test: Delete Link
Deno.test("Delete Link: Deletes an existing link successfully", async () => {
  await resetMockConfig();
  await deleteLink("docs", tempConfigPath);
  const links = readLinksConfig(tempConfigPath);
  assertEquals(links["docs"], undefined);
});

// Test: List Links
Deno.test("List Links: Lists all available links", async () => {
  await resetMockConfig();
  const links = readLinksConfig(tempConfigPath);
  assertEquals(Object.keys(links).length, 2);
  assertEquals(links["dashboard"], "https://dashboard.com");
  assertEquals(links["docs"], "https://docs.com");
});

// Test: Resolve Link
Deno.test("Resolve Link: Resolves an existing link", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("dashboard");
  assertEquals(resolvedLink, "https://dashboard.com");
});

// Test: Resolve Non-Existent Link
Deno.test("Resolve Link: Returns null for a non-existent link", async () => {
  await resetMockConfig();
  const resolvedLink = resolveLink("nonexistent");
  assertEquals(resolvedLink, null);
});
