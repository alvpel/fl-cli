import { assertEquals, assertExists } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import {
  addLink,
  deleteLink,
  editLink,
  replaceLink,
  resolveLink,
} from "../src/services/linkService.ts";
import {
  initConfig,
  readLinksConfig,
  writeLinksConfig,
} from "../src/config/configService.ts";
import { join } from "jsr:@std/path";
import { handleFlCommand } from "../src/commands/commandDispatcher.ts";

// Use a temporary file for testing
const testConfigPath = join(Deno.cwd(), "tests", "links.test.json");

// Mock data for testing
const mockLinks = {
  dashboard: { baseUrl: "https://dashboard.com" },
  g: {
    baseUrl: "https://www.google.com",
    variablePattern: "https://www.google.com/search?q={*}",
  },
};

// Helper to reset the mock configuration before each test
async function resetMockConfig() {
  await writeLinksConfig(mockLinks, testConfigPath);
}

// Default services object with mock functions for all required methods
function createMockServices(overrides = {}) {
  return {
    listLinks: spy(() => {}),
    shortlistLinks: spy(() => {}),
    addLink: spy(() => Promise.resolve()), // Returning a resolved promise
    replaceLink: spy(() => Promise.resolve()), // Returning a resolved promise
    editLink: spy(() => Promise.resolve()), // Returning a resolved promise
    deleteLink: spy(() => Promise.resolve()), // Returning a resolved promise
    resolveLink: spy(() => Promise.resolve()), // Returning a resolved promise
    help: spy(() => {}),
    ...overrides, // Override specific methods if needed
  };
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
  await addLink(
    "bing",
    "https://www.bing.com",
    "https://www.bing.com/search?q={*}",
    testConfigPath,
  );
  const links = readLinksConfig(testConfigPath);
  assertExists(links["bing"]);
  assertEquals(links["bing"].baseUrl, "https://www.bing.com");
  assertEquals(
    links["bing"].variablePattern,
    "https://www.bing.com/search?q={*}",
  );
});

// Test: Replace Link with Variable Pattern
Deno.test("Replace Link: Replaces an existing link to include a variable pattern", async () => {
  await resetMockConfig();
  await replaceLink(
    "dashboard",
    "dashboard",
    "https://dashboard-updated.com",
    "https://dashboard-updated.com/page?q={*}",
    testConfigPath,
  );
  const links = readLinksConfig(testConfigPath);
  assertExists(links["dashboard"]);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard-updated.com");
  assertEquals(
    links["dashboard"].variablePattern,
    "https://dashboard-updated.com/page?q={*}",
  );
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
  await editLink(
    "g",
    "--vlink",
    "https://www.google.com/search?q={*}",
    testConfigPath,
  );
  const links = readLinksConfig(testConfigPath);
  assertEquals(
    links["g"].variablePattern,
    "https://www.google.com/search?q={*}",
  );
});

// Test: Edit Link with Invalid Field
Deno.test("Edit Link: Fails when using an invalid field", async () => {
  await resetMockConfig();
  try {
    await editLink("google", "--invalid", "value", testConfigPath);
  } catch (e) {
    assertEquals(e as string, "Invalid field. Use --name, --link, or --vlink.");
  }
});

// Test: Resolve Link with Variable
Deno.test("Resolve Link: Resolves a link with a variable correctly", async () => {
  await resetMockConfig();
  const openUrlMock = spy(async (url: string) => {
    await console.log(`Mock opening: ${url}`);
  });
  await resolveLink("g/test", testConfigPath, openUrlMock);

  assertSpyCalls(openUrlMock, 1);
  assertEquals(
    openUrlMock.calls[0].args[0],
    "https://www.google.com/search?q=test",
  );
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
Deno.test("Resolve Link: Returns null for a non-existent link", async () => {
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

// Test: List Links Including Variable Pattern
Deno.test("List Links: Lists all links including those with variable patterns", async () => {
  await resetMockConfig();
  const links = readLinksConfig(testConfigPath);
  assertEquals(Object.keys(links).length, 2);
  assertEquals(links["dashboard"].baseUrl, "https://dashboard.com");
  assertEquals(links["g"].baseUrl, "https://www.google.com");
  assertEquals(
    links["g"].variablePattern,
    "https://www.google.com/search?q={*}",
  );
});

Deno.test("handleFlCommand should call listLinks for --list command", () => {
  const services = createMockServices({ listLinks: spy() });
  handleFlCommand("--list", [], services);
  assertSpyCalls(services.listLinks, 1);
});

Deno.test("handleFlCommand should call shortlistLinks for --shortlist command", () => {
  const services = createMockServices({ shortlistLinks: spy() });
  handleFlCommand("--shortlist", [], services);
  assertSpyCalls(services.shortlistLinks, 1);
});

Deno.test("handleFlCommand should call addLink for --add command", async () => {
  const services = createMockServices({ addLink: spy() });
  await handleFlCommand(
    "--add",
    ["google", "https://www.google.com"],
    services,
  );
  assertSpyCalls(services.addLink, 1);
});

Deno.test("handleFlCommand should call replaceLink for --replace command", async () => {
  const services = createMockServices({ replaceLink: spy() });
  await handleFlCommand("--replace", [
    "google",
    "g",
    "https://www.google.com",
    "",
  ], services);
  assertSpyCalls(services.replaceLink, 1);
});

Deno.test("handleFlCommand should call editLink for --edit command with --name", async () => {
  const services = createMockServices({ editLink: spy() });
  await handleFlCommand("--edit", ["google", "--name", "g"], services);
  assertSpyCalls(services.editLink, 1);
});

Deno.test("handleFlCommand should call deleteLink for --delete command", async () => {
  const services = createMockServices({ deleteLink: spy() });
  await handleFlCommand("--delete", ["google"], services);
  assertSpyCalls(services.deleteLink, 1);
});

Deno.test("handleFlCommand should call resolveLink for default case", async () => {
  const services = createMockServices({ resolveLink: spy() });
  await handleFlCommand("google", ["google"], services);
  assertSpyCalls(services.resolveLink, 1);
});

Deno.test("handleFlCommand should call help for --help command", () => {
  const services = createMockServices({ help: spy() });
  handleFlCommand("--help", [], services);
  assertSpyCalls(services.help, 1);
});

Deno.test("editLink should log error for invalid edit field", async () => {
  const consoleErrorSpy = spy(console, "error");

  const services = createMockServices({
    editLink: editLink,
  });

  await handleFlCommand("--edit", ["g", "--invalid", "new-value"], services);

  assertSpyCalls(consoleErrorSpy, 1);
  assertEquals(
    consoleErrorSpy.calls[0].args[0],
    "Invalid field, use --name, --link or --vlink",
  );

  consoleErrorSpy.restore();
});
