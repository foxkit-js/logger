import type { InspectOptions } from "util";

// TEMPLATES

/**
 * Template with options. Templates are used for the prefix of your log messages
 */
export interface TemplateOpts {
  /**
   * Prefix Template string
   */
  template: string;
  /**
   * Whether to use UTC (`true`) or local timezone (`false`) when logging with
   * this template. Default: `false`
   */
  utc?: boolean;
  /**
   * Hour notation system (either `12` or `24`). Default: `24`
   */
  hours?: 12 | 24;
}

export interface ResolvedTemplateOpts extends Required<TemplateOpts> {
  padLen: number;
}

// LOG LEVELS

/**
 * Color Middleware that can be used to color or transform parts or the full
 * prefix (see also `colorMode`)
 */
export type ColorMiddleware = (str: string) => string;

export interface LevelOpts<Name extends string> {
  /**
   * Name of the Log Level. This name (in all lowercase) will be used for the
   * method name of the log level on the `Logger.log` object.
   */
  name: Name;
  /**
   * Optional override for the template used when logging using this log level.
   * Note that defaults are taken from the default template of the logger!
   */
  template?: TemplateOpts | string;
  /**
   * Color Middleware that can be used to color or transform parts or the full
   * prefix (see also `colorMode`)
   */
  color?: ColorMiddleware;
  /**
   * Whether to apply the Color Middleware on the entire prefix (`"full"`) or
   * just the `%name%` variables (`"name"`). Default: `"name"`
   */
  colorMode?: "name" | "full";
  /**
   * Which console method to use when logging using this log level. Can be any
   * of: `"log"`, `"warn"`, `"error"`. Default: `"log"`
   */
  type?: "log" | "warn" | "error";
}

export interface ResolvedLevelOpts<Name extends string>
  extends LevelOpts<Name> {
  template: ResolvedTemplateOpts;
  colorMode: NonNullable<LevelOpts<Name>["colorMode"]>;
  type: NonNullable<LevelOpts<Name>["type"]>;
}

// LOGGER

export interface LoggerOpts<Level extends string> {
  /**
   * Names or Options for every Log Level in order of severity (least to highest)
   */
  levels: Array<Level | LevelOpts<Level>>;
  /**
   * Default Log Level to pick if environment variable `LOG_LEVEL` is unset
   */
  defaultLevel: Level; // BUG: Can introduce invalid values to generic
  /**
   * Default Template to use for Log Levels without overrides
   */
  template: TemplateOpts | string;
  /**
   * Options passed to `util.inspect` when logging non-string values
   */
  inspectOpts?: InspectOptions;
}

export interface ResolvedLoggerOpts<Level extends string>
  extends LoggerOpts<Level> {
  levels: Array<ResolvedLevelOpts<Level>>;
  defaultLevel: Level;
  template: ResolvedTemplateOpts;
  inspectOpts: InspectOptions | undefined;
}

export type LogFn = (arg: unknown, opts?: InspectOptions) => void;
