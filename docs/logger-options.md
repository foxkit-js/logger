# Logger

`LoggerOpts` are passed as an object to `createLogger()` to create your `log` and `logger` objects:

```ts
// logger.ts
import { createLogger } from "@foxkit/logger";

const { log, logger } = createLogger({
  levels: ["Debug", "Warn", "Error", "FATAL"],
  defaultLevel: "warn",
  template: "%#name% -",
  inspectOpts: { colors: true, depth: 3 }
});

export { log, logger };
```

## Required Options

- `levels`: Array of Names or [LevelOpts](./customizing-log-levels.md) in order of severity (least to highest)
- `defaultLevel`: Default Log Level to pick if environment variable `LOG_LEVEL` is unset
- `template`: Default Template to use for Log Levels without overrides. See also [Prefix Template Options](./prefix-template-options.md)

## Available Options

- `inspectOpts`: Options passed to `node:util.inspect` when logging non-string values
  - should Color Middleware be disabled, `inspectOpts.colors` will be forced to `false`. See [Configuration via Enviroment Variables](./env-variables.md#force_color) for more information.

## Logging with `log`

Now you can import your `log` object to use in any part of your project:

```ts
// main.ts
import { log } from "./utils/logger";

/*
...
*/

main()
  .then(() => log.debug("Completed"))
  .catch(e => log.fatal(e));
```

Log Functions also accept overrides to the options passed to `node:util.inspect` as a second parameter:

```ts
log.debug(aLongArray, { colors: false, depth: 1 });
```

## Changing Settings

The `logger` object is used to change settings

### Current Log Level

- `logger.getLogLevel`: Returns the currently set Log Level's name
- `logger.setLogLevel`: Change the current Log Level

```ts
import { log, logger } from "./utils/logger";

const oldlvl = logger.getLogLevel();
logger.setLogLevel("Debug");
log.info(`Changed log level from '${oldlvl}' to '${logger.getLogLevel()}'`);
```

### Toggling Color Middleware

- `logger.getColorEnabled`: Checks whether Color Middleware is enabled
- `logger.setColor`: Change or reset Color Middleware
- Both functions take an optional parameter to select whether the setting should be changed for `"log"` (i.e. `console.log`) or `"error"` (i.e. `console.error` and `console.warn`). If omitted `"log"` is used as the default value.
- Note that [Environment Variables](./env-variables.md#force_color) can be used to disable color support globally. You cannot enable Color Middleware if color support is disabled globally!
- You can use the `getColorSupport` utility to check whether Color Middleware is supported

```ts
import { getColorSupport } from "@foxkit/logger";
import { logger } from "./utils/logger";

getColorSupport(); // true if supported by "log"
getColorSupport("error"); // true if supported by "error"

logger.getColorEnabled(); // true if enabled for "log"
logger.setColor(false); // disables color
logger.setColor("reset"); // resets color to what it was by default

logger.getColorEnabled("error"); // true if enabled for "error"
logger.setColor(false, "error"); // disables color for "error"
```
