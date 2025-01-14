import { padStr } from "./padStr";
import type { ResolvedLevelOpts } from "./types";

function formatNameVar<Name extends string = string>(
  str: string,
  level: ResolvedLevelOpts<Name>,
  colorEnabled: boolean
): string {
  let direction: null | "left" | "center" | "right" = null;
  const strInner = str.replace(/%|#/g, "");
  let output: string = level.name;
  const realLength = output.length;

  // determine padding direction
  if (str.startsWith("%#")) direction = "left";
  if (str.endsWith("#%")) {
    direction = direction == "left" ? "center" : "right";
  }

  // check whether strInner is all lowercase or all uppercase
  switch (strInner) {
    case "name":
      output = level.name.toLowerCase();
      break;
    case "NAME":
      output = level.name.toUpperCase();
      break;
  }

  // use color middleware if set and mode is "name"
  if (colorEnabled && level.color && level.colorMode == "name") {
    output = level.color(output);
  }

  // return with padding if set
  return direction
    ? padStr(output, { len: level.template.padLen, direction, realLength })
    : output;
}

/**
 * Takes resolved level options and returns template prefix with name variables
 * transformed and color middleware applied
 *
 * @param level ResolvedLevelOpts
 * @returns Prefix template
 */
export function formatName<Name extends string = string>(
  level: ResolvedLevelOpts<Name>,
  colorEnabled: boolean
) {
  let prefix = level.template.template.replace(/%#?name#?%/gi, str =>
    formatNameVar(str, level, colorEnabled)
  );

  // use color middleware if set and mode is "full"
  if (colorEnabled && level.color && level.colorMode == "full") {
    prefix = level.color(prefix);
  }

  return prefix;
}
