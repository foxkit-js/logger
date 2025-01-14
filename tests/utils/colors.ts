import * as picocolors from "picocolors";
import { getColorSupport } from "../../src/color";

export const colorSupport = {
  stdout: getColorSupport(),
  stderr: getColorSupport("error")
} as const;

console.log(
  `Color Support detected:
  stdout: ${colorSupport.stdout} (${colorSupport.stdout ? "Using color in tests" : "⚠️ Disabling color in tests"})
  stderr: ${colorSupport.stderr}`
);

export const col = picocolors.createColors(colorSupport.stdout);
