// linkService.test.ts
import { assertEquals, assertExists } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import {
  addLink,
  deleteLink,
  editLink,
  replaceLink,
  resolveLink,
} from "../src/services/linkService.ts";
import { readLinksConfig } from "../src/config/configService.ts";
import { resetMockConfig, testConfigPath } from "./testHelper.ts";

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
  const consoleErrorSpy = spy(console, "error");

  await editLink("g", "--invalid", "value", testConfigPath);

  assertSpyCalls(consoleErrorSpy, 1);
  assertEquals(consoleErrorSpy.calls[0].args[0], "Invalid field, use --name, --link or --vlink");

  consoleErrorSpy.restore();
});

// Test: Resolve Link with Variable
Deno.test("Resolve Link: Resolves a link with a variable correctly", async () => {
  await resetMockConfig();
  const openUrlMock = spy(async (url: string) => {
    await console.log(`Mock opening: ${url}`);
  });

  await resolveLink("g/test", testConfigPath, openUrlMock);
  assertSpyCalls(openUrlMock, 1);
  assertEquals(openUrlMock.calls[0].args[0], "https://www.google.com/search?q=test");
});

// Test: Resolve Link without Variable
Deno.test("Resolve Link: Resolves a link without a variable correctly", async () => {
  await resetMockConfig();
  const openUrlMock = spy(async (url: string) => {
    await console.log(`Mock opening: ${url}`);
  });

  await resolveLink("g", testConfigPath, openUrlMock);
  assertSpyCalls(openUrlMock, 1);
  assertEquals(openUrlMock.calls[0].args[0], "https://www.google.com");
});

// Test: Resolve Non-Existent Link
Deno.test("Resolve Link: Logs error for a non-existent link", async () => {
  await resetMockConfig();
  const openUrlMock = spy(async (url: string) => {
    await console.log(`Mock opening: ${url}`);
  });
  const consoleLog = spy(console, "log");

  await resolveLink("unknown", testConfigPath, openUrlMock);
  assertSpyCalls(openUrlMock, 0);
  assertSpyCalls(consoleLog, 1);
  assertEquals(consoleLog.calls[0].args[0], 'No fast link found for "unknown"');

  consoleLog.restore();
});

// Test: Delete Link with Variable Pattern
Deno.test("Delete Link: Deletes a link with a variable pattern successfully", async () => {
  await resetMockConfig();
  await deleteLink("g", testConfigPath);
  const links = readLinksConfig(testConfigPath);
  assertEquals(links["g"], undefined);
});
