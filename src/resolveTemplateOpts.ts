import type { ResolvedTemplateOpts, TemplateOpts } from "./types";

/**
 * Resolves Template Options
 * @param template TemplateOpts (or string) to resolve
 * @param defaultArg Global default template or padLen
 * @returns Resolved Template Options
 */
export function resolveTemplateOpts(
  template: TemplateOpts | string,
  defaultArg: ResolvedTemplateOpts | number
) {
  const defaultTemplate =
    typeof defaultArg == "object" ? defaultArg : undefined;
  const templateObj: TemplateOpts =
    typeof template == "object" ? template : { template };

  const resolvedTemplate: ResolvedTemplateOpts = {
    template: typeof template == "string" ? template : template.template,
    utc: templateObj.utc ?? defaultTemplate?.utc ?? false,
    hours: templateObj.hours ?? defaultTemplate?.hours ?? 24,
    padLen: typeof defaultArg == "number" ? defaultArg : defaultArg.padLen
  };

  return resolvedTemplate;
}
