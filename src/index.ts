import { inspect } from "util";
import type { LogFn, LoggerOpts, ResolvedLevelOpts } from "./types";
import { formatName } from "./formatName";
import { formatTime } from "./formatTime";
import { resolveLoggerOpts } from "./resolveLoggerOpts";
import { createColorToggles } from "./color";

export { getColorSupport } from "./color";

export function createLogger<Level extends string>(opts: LoggerOpts<Level>) {
  const loggerOpts = resolveLoggerOpts(opts);
  const levels = loggerOpts.levels.map(level => level.name);
  const colorToggles = createColorToggles();
  let currentLevel = loggerOpts.defaultLevel;
  let currentLevelIdx = levels.indexOf(currentLevel);

  // map level opts for internal use
  const levelsMap = Object.fromEntries(
    loggerOpts.levels.map(levelOpts => [levelOpts.name, levelOpts])
  ) as Record<Level, ResolvedLevelOpts<Level>>;

  // Logger.logger utils functions
  function setLogLevel(level: Level) {
    currentLevel = level;
    currentLevelIdx = levels.indexOf(currentLevel);
  }

  function getLogLevel() {
    return currentLevel;
  }

  /**
   * Checks whether color is enabled for an output stream
   * @param stream Either `"log"` (stdout) or `"error"` (stderr). Default: `"log"`
   * @returns boolean, `true` if enabled
   */
  function getColorEnabled(stream?: "log" | "error") {
    const toggle = colorToggles.toggles[stream || "log"];
    return toggle.isEnabled;
  }

  const utils = {
    setLogLevel,
    getLogLevel,
    getColorEnabled,
    setColor: colorToggles.toggleColor
  };

  // Logger.log log functions
  const log = Object.fromEntries(
    levels.map((level, levelIdx) => {
      const logFn: LogFn = (arg, opts) => {
        const levelOpts = levelsMap[level];
        // quit early if level is too low
        if (levelIdx < currentLevelIdx) return;
        const colorEnabled =
          colorToggles.toggles[levelOpts.type == "log" ? "log" : "error"]
            .isEnabled;

        // merge inspectOpts with logger defaults
        const inspectOpts = Object.assign({}, loggerOpts.inspectOpts, opts);
        if (!colorEnabled) {
          // if output stream does not support color, force disable color opt
          inspectOpts.colors = false;
        }

        // resolve arg
        const argStr = typeof arg == "string" ? arg : inspect(arg, inspectOpts);

        // resolve prefix
        const prefix = formatTime(
          formatName(levelOpts, colorEnabled),
          new Date(),
          levelOpts.template.utc,
          levelOpts.template.hours
        );

        // build message
        const msg = prefix + (argStr.includes("\n") ? "\n" : " ") + argStr;

        // perform log
        console[levelOpts.type](msg);
      };

      return [level.toLowerCase() as Lowercase<Level>, logFn];
    })
  ) as Record<Lowercase<Level>, LogFn>;

  return { log, logger: utils };
}
