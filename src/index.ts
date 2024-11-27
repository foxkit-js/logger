import { inspect } from "util";
import { resolveLoggerOpts } from "./resolveLoggerOpts";
import type { LogFn, LoggerOpts, ResolvedLevelOpts } from "./types";
import { formatName } from "./formatName";
import { formatTime } from "./formatTime";

export function createLogger<Level extends string>(opts: LoggerOpts<Level>) {
  const loggerOpts = resolveLoggerOpts(opts);
  const levels = loggerOpts.levels.map(level => level.name);
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

  const utils = { setLogLevel, getLogLevel };

  // Logger.log log functions
  const log = Object.fromEntries(
    levels.map((level, levelIdx) => {
      const logFn: LogFn = (arg, opts) => {
        const levelOpts = levelsMap[level];
        // quit early if level is too low
        if (levelIdx < currentLevelIdx) return;

        // resolve arg
        const inspectOpts = Object.assign({}, loggerOpts.inspectOpts, opts);
        const argStr = typeof arg == "string" ? arg : inspect(arg, inspectOpts);

        // resolve prefix
        const prefix = formatTime(
          formatName(levelOpts),
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
