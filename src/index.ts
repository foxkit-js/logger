/* eslint-disable */

interface LogLevel {
  level: number;
}

function createLogger<TKey extends string>(levels: Record<TKey, LogLevel>) {
  return {} as Record<TKey, () => void>;
}
