/* eslint-disable */

import type { LogLevelOpts } from "./LogLevel";

function createLogger<TKey extends string>(
  levels: Array<LogLevelOpts & { name: TKey }>
) {
  return {} as Record<Lowercase<TKey>, () => void>;
}
