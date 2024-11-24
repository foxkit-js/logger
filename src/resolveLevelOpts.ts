import { resolveTemplateOpts } from "./resolveTemplateOpts";
import type {
  LevelOpts,
  ResolvedLevelOpts,
  ResolvedTemplateOpts
} from "./types";

export function resolveLevelOpts<Name extends string = string>(
  level: LevelOpts<Name> | Name,
  defaultTemplate: ResolvedTemplateOpts
) {
  const levelObj: LevelOpts<Name> =
    typeof level == "object" ? level : { name: level };
  const template: ResolvedTemplateOpts = levelObj.template
    ? resolveTemplateOpts(levelObj.template, defaultTemplate)
    : defaultTemplate;

  const resolvedOpts: ResolvedLevelOpts<Name> = {
    name: levelObj.name,
    template,
    color: levelObj.color,
    colorMode: levelObj.colorMode || "name",
    type: levelObj.type || "log"
  };

  return resolvedOpts;
}
