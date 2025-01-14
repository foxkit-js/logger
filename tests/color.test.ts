import { test } from "uvu";
import * as assert from "uvu/assert";
import { createLogger } from "../src";
import { colorSupport } from "./utils/colors";

const { logger } = createLogger({
  levels: ["test"],
  defaultLevel: "test",
  template: "%name% -"
});

function testIfSupported() {
  const initialState = logger.getColorEnabled();
  assert.ok(initialState, "Should be enabled by default");
  logger.setColor(false);
  const changedTo = logger.getColorEnabled();
  assert.not(changedTo, "Should now be disabled");
  logger.setColor("reset");
  const resetTo = logger.getColorEnabled();
  assert.ok(resetTo, "Should be enabled again");
}

function testIfNotSupported() {
  const initialState = logger.getColorEnabled();
  assert.not(initialState, "Should not be enabled by default");
  logger.setColor(true);
  const changedTo = logger.getColorEnabled();
  assert.not(changedTo, "Should still be disabled");
}

test(
  "toggleable color support",
  colorSupport.stdout ? testIfSupported : testIfNotSupported
);

test("default value for stderr", () => {
  const expected = colorSupport.stderr ? "ok" : "not";
  assert[expected](
    logger.getColorEnabled("error"),
    `Should be ${expected == "ok" ? "en" : "dis"}abled by default`
  );
});

test.run();
