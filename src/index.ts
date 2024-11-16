/* eslint-disable */

import type { LogLevelOpts } from "./LogLevel";

interface LogLevelSettings<TKey extends string>
  extends Omit<LogLevelOpts, "padLen"> {
  name: TKey;
}

interface CreateLoggerOpts<TKey extends string> {
  levels: Array<LogLevelSettings<TKey>>;
  defaultLevel: TKey;
}

function createLogger<TKey extends string>({
  levels,
  defaultLevel
}: CreateLoggerOpts<TKey>) {
  return {} as Record<Lowercase<TKey>, () => void>;
}
