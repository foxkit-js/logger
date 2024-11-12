import { test } from "uvu";
import * as assert from "uvu/assert";
import { LogLevel } from "../src/LogLevel";

test("processTemplate - variables", () => {
  const level = new LogLevel({ name: "Test", msgTemplate: "%Name% -" });
  assert.is(
    level.processTemplate("foobar"),
    "Test - foobar",
    "correctly replaces name variable"
  );
});

test("processTemplate - file template", () => {
  const level = new LogLevel({
    name: "Test",
    msgTemplate: "%name% -",
    fileMsgTemplate: "[%NAME%]:"
  });
  assert.is(
    level.processTemplate("foobar"),
    "test - foobar",
    "correctly uses log template with lowercase name"
  );
  assert.is(
    level.processTemplate("foobar", true),
    "[TEST]: foobar",
    "correctly uses name file template with uppercase name"
  );
});

test("processTemplate - padded Name variables", () => {
  const levelL = new LogLevel({
    name: "Test",
    msgTemplate: "%#NAME%:",
    padLen: 6
  });
  assert.is(levelL.processTemplate("foo"), "  TEST: foo", "left padded name");

  const levelR = new LogLevel({
    name: "Test",
    msgTemplate: "%NAME#%:",
    padLen: 6
  });
  assert.is(levelR.processTemplate("foo"), "TEST  : foo", "right padded name");

  const levelC = new LogLevel({
    name: "Test",
    msgTemplate: "%#NAME#%:",
    padLen: 6
  });
  assert.is(levelC.processTemplate("foo"), " TEST : foo", "center padded name");

  const levelC2 = new LogLevel({
    name: "Test",
    msgTemplate: "%#NAME#%:",
    padLen: 7
  });
  assert.is(
    levelC2.processTemplate("foo"),
    " TEST  : foo",
    "uneven center padded name"
  );
});

test.run();
