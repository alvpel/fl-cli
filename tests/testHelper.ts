import { join } from "jsr:@std/path";
import { writeLinksConfig, initConfig } from "../src/config/configService.ts";
import { spy } from "jsr:@std/testing/mock";

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
export async function resetMockConfig() {
  await writeLinksConfig(mockLinks, testConfigPath);
}

// Default services object with mock functions for all required methods
export function createMockServices(overrides = {}) {
  return {
    listLinks: spy(() => {}),
    shortlistLinks: spy(() => {}),
    addLink: spy(() => Promise.resolve()),
    replaceLink: spy(() => Promise.resolve()),
    editLink: spy(() => Promise.resolve()),
    deleteLink: spy(() => Promise.resolve()),
    resolveLink: spy(() => Promise.resolve()),
    help: spy(() => {}),
    ...overrides,
  };
}

initConfig(testConfigPath);
export { testConfigPath };
