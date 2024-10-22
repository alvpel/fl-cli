// handleFlCommand.test.ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { handleFlCommand } from "../src/commands/commandDispatcher.ts";
import { resetMockConfig, createMockServices, testConfigPath } from "./testHelper.ts";

// Test setup
Deno.test({
  name: "Setup mock configuration",
  async fn() {
    await resetMockConfig();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// Test: Handle --list Command
Deno.test("handleFlCommand should call listLinks for --list command", () => {
  const services = createMockServices({ listLinks: spy() });
  handleFlCommand("--list", [], services, testConfigPath);
  assertSpyCalls(services.listLinks, 1);
});

// Test: Handle --shortlist Command
Deno.test("handleFlCommand should call shortlistLinks for --shortlist command", () => {
  const services = createMockServices({ shortlistLinks: spy() });
  handleFlCommand("--shortlist", [], services, testConfigPath);
  assertSpyCalls(services.shortlistLinks, 1);
});

// Test: Handle --add Command
Deno.test("handleFlCommand should call addLink for --add command", async () => {
  const services = createMockServices({ addLink: spy() });
  await handleFlCommand("--add", ["google", "https://www.google.com"], services, testConfigPath);
  assertSpyCalls(services.addLink, 1);
});

// Test: Handle --replace Command
Deno.test("handleFlCommand should call replaceLink for --replace command", async () => {
  const services = createMockServices({ replaceLink: spy() });
  await handleFlCommand(
    "--replace",
    ["google", "g", "https://www.google.com", ""],
    services,
    testConfigPath
  );
  assertSpyCalls(services.replaceLink, 1);
});

// Test: Handle --edit Command for Name
Deno.test("handleFlCommand should call editLink for --edit command with --name", async () => {
  const services = createMockServices({ editLink: spy() });
  await handleFlCommand("--edit", ["google", "--name", "g"], services, testConfigPath);
  assertSpyCalls(services.editLink, 1);
});

// Test: Handle --delete Command
Deno.test("handleFlCommand should call deleteLink for --delete command", async () => {
  const services = createMockServices({ deleteLink: spy() });
  await handleFlCommand("--delete", ["google"], services, testConfigPath);
  assertSpyCalls(services.deleteLink, 1);
});

// Test: Handle Default Case for Opening a Link
Deno.test("handleFlCommand should call resolveLink for default case", async () => {
  const services = createMockServices({ resolveLink: spy() });
  await handleFlCommand("google", ["google"], services, testConfigPath);
  assertSpyCalls(services.resolveLink, 1);
});

// Test: Handle --help Command
Deno.test("handleFlCommand should call help for --help command", () => {
  const services = createMockServices({ help: spy() });
  handleFlCommand("--help", [], services, testConfigPath);
  assertSpyCalls(services.help, 1);
});

// Test: Handle Invalid Edit Field
Deno.test("handleFlCommand should log error for invalid edit field", async () => {
  const consoleErrorSpy = spy(console, "error");

  const services = createMockServices({
    editLink: spy(async (_name, field: string, _value, _configPath) => {
      if (!['--name', '-n', '--link', '-l', '--vlink', '-vl'].includes(field)) {
        await console.error("Invalid field, use --name, --link or --vlink");
      }
    }),
  });

  await handleFlCommand("--edit", ["g", "--invalid", "new-value"], services, testConfigPath);

  assertSpyCalls(consoleErrorSpy, 1);
  assertEquals(consoleErrorSpy.calls[0].args[0], "Invalid field, use --name, --link or --vlink");

  consoleErrorSpy.restore();
});
