import { test } from "uvu";
import * as assert from "uvu/assert";
import { formatName } from "../src/formatName";
import type { ResolvedLevelOpts } from "../src/types";
import { col, colorSupport } from "./utils/colors";

test("transform name variables in template", () => {
  const level: ResolvedLevelOpts<"test"> = {
    name: "test",
    template: { template: "%name% -", padLen: 4, utc: false, hours: 24 },
    colorMode: "name",
    type: "log"
  };
  const prefix = formatName(level, false);
  assert.is(prefix, "test -", "transforms simple log level prefix");
});

test("transforms to uppercase with %NAME%", () => {
  const level: ResolvedLevelOpts<"test"> = {
    name: "test",
    template: { template: "%NAME% -", padLen: 4, utc: false, hours: 24 },
    colorMode: "name",
    type: "log"
  };
  const prefix = formatName(level, false);
  assert.is(prefix, "TEST -", "transforms name to uppercase with %NAME%");
});

test("applies name colouring", () => {
  const level: ResolvedLevelOpts<"test"> = {
    name: "test",
    template: { template: "%name% -", padLen: 4, utc: false, hours: 24 },
    color: col.gray,
    colorMode: "name",
    type: "log"
  };
  const prefix = formatName(level, colorSupport.stdout);
  assert.is(
    prefix,
    `${col.gray("test")} -`,
    "transforms log level prefix with name colouring"
  );
});

test("applies full colouring", () => {
  const level: ResolvedLevelOpts<"test"> = {
    name: "test",
    template: { template: "%name% -", padLen: 4, utc: false, hours: 24 },
    color: col.gray,
    colorMode: "full",
    type: "log"
  };
  const prefix = formatName(level, colorSupport.stdout);
  assert.is(
    prefix,
    col.gray("test -"),
    "transforms log level prefix with full colouring"
  );
});

test.run();
