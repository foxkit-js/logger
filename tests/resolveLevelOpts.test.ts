import { test } from "uvu";
import * as assert from "uvu/assert";
import { resolveLevelOpts } from "../src/resolveLevelOpts";
import type { ResolvedTemplateOpts } from "../src/types";

const template: ResolvedTemplateOpts = {
  template: "- %#name%:",
  hours: 24,
  utc: true,
  padLen: 20
};

test("it resolves level opts from string arg", () => {
  const opts = resolveLevelOpts("Test", template);
  assert.equal(opts, {
    name: "Test",
    template,
    color: undefined,
    colorMode: "name",
    type: "log"
  });
});

test("it resolves level opts from incomplete object arg", () => {
  const opts = resolveLevelOpts(
    {
      name: "Warning",
      type: "warn"
    },
    template
  );
  assert.equal(opts, {
    name: "Warning",
    template,
    color: undefined,
    colorMode: "name",
    type: "warn"
  });
});

test("it resolves template property to resolved template", () => {
  const mockColFn = (str: string) => str;
  const opts = resolveLevelOpts(
    {
      name: "Error",
      template: "⛔ %#NAME%:",
      type: "error",
      color: mockColFn,
      colorMode: "full"
    },
    template
  );
  assert.equal(opts, {
    name: "Error",
    template: { ...template, template: "⛔ %#NAME%:" },
    color: mockColFn,
    colorMode: "full",
    type: "error"
  });
});

test.run();
