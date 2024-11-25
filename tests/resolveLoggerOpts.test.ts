import { test } from "uvu";
import * as assert from "uvu/assert";
import { resolveLoggerOpts } from "../src/resolveLoggerOpts";

test.before.each(() => {
  delete process.env.LOG_LEVEL;
});

test("it throws for invalid defaultLevel value", () => {
  assert.throws(
    () => {
      resolveLoggerOpts({
        levels: ["a", "b"],
        defaultLevel: "c",
        template: "%name%"
      });
    },
    "Could not resolve Logger options, could not find default level 'c'",
    "throws for invalid defaultLevel value passed in opts"
  );
});

test("it throws for invalid LOG_LEVEL env value", () => {
  process.env.LOG_LEVEL = "c";
  assert.throws(
    () => {
      resolveLoggerOpts({
        levels: ["a", "b"],
        defaultLevel: "a",
        template: "%name%"
      });
    },
    "Could not resolve Logger options, could not find default level 'c' (set via env)",
    "throws for invalid defaultLevel value passed in env var"
  );
});

test("it throws for duplicate keys in levels array", () => {
  assert.throws(
    () => {
      resolveLoggerOpts({
        levels: ["a", "A", "b"],
        defaultLevel: "a",
        template: "%name%"
      });
    },
    "Could not resolve Logger options, duplicate key 'A'",
    "throws for duplicate keys in levels array"
  );
});

test.run();
