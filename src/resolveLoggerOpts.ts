import { resolveLevelOpts } from "./resolveLevelOpts";
import { resolveTemplateOpts } from "./resolveTemplateOpts";
import type { LoggerOpts, ResolvedLoggerOpts } from "./types";

function isLevel<Level extends string>(
  name: string | undefined,
  set: Set<Lowercase<Level>>
): name is Level {
  if (!name) return false;
  const nameLc = name.toLowerCase() as Lowercase<Level>;
  return set.has(nameLc);
}

export function resolveLoggerOpts<Level extends string>(
  logger: LoggerOpts<Level>
) {
  // validate level names
  const levelSet = new Set<Lowercase<Level>>();
  for (const level of logger.levels) {
    const name = typeof level == "string" ? level : level.name;
    const nameLc = name.toLowerCase() as Lowercase<Level>;
    if (levelSet.has(nameLc)) {
      throw new Error(
        `Could not resolve Logger options, duplicate key '${nameLc}'`
      );
    }
    levelSet.add(nameLc);
  }

  // make sure defaultLevel is valid too
  const defaultLevel = process.env.LOG_LEVEL || logger.defaultLevel;
  if (!isLevel(defaultLevel, levelSet)) {
    throw new Error(
      `Could not resolve Logger options, could not find default level '${defaultLevel}'${defaultLevel === process.env.LOG_LEVEL ? " (set via env)" : ""}`
    );
  }

  // resolve template and levels
  const padLen = Math.max(...Array.from(levelSet, name => name.length));
  const template = resolveTemplateOpts(logger.template, padLen);
  const levels = logger.levels.map(level => resolveLevelOpts(level, template));

  const resolvedOpts: ResolvedLoggerOpts<Level> = {
    levels,
    template,
    defaultLevel,
    inspectOpts: logger.inspectOpts
  };

  return resolvedOpts;
}
