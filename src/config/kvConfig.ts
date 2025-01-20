// import { openKv } from "deno-kv";

const isTestEnv = Deno.env.get("TEST_ENV") === "true";
const kv = await Deno.openKv({ path: isTestEnv ? "./test_links.db" : "./links.db" });
export default kv;