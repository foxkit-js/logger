import { test } from "uvu";
import * as assert from "uvu/assert";
import { resolveTemplateOpts } from "../src/resolveTemplateOpts";

test("Resolves template given padLen", () => {
  const template = resolveTemplateOpts("test", 8);
  assert.equal(
    template,
    { template: "test", hours: 24, utc: false, padLen: 8 },
    "resolves string arg and padLen arg to fully resolved opts"
  );
});

test("Resolves template using defaults from defaultTemplate arg", () => {
  const templateA = resolveTemplateOpts(
    { template: "test default", hours: 12, utc: true },
    20
  );
  assert.equal(
    templateA,
    { template: "test default", hours: 12, utc: true, padLen: 20 },
    "resolves object arg and padLen arg to fully resolved opts"
  );
  const templateB = resolveTemplateOpts("sub template", templateA);
  assert.equal(
    templateB,
    { ...templateA, template: "sub template" },
    "uses defaults taken from object defaultArg"
  );
  const templateC = resolveTemplateOpts(
    { template: "sub template", hours: 24 },
    templateA
  );
  assert.equal(
    templateC,
    { ...templateA, template: "sub template", hours: 24 },
    "correctly overrides properties, only taking from object defaultArg as needed"
  );
});

test.run();
