# Foxkit Logger

Highly customizable logger with TypeScript support

- Set your own Log Levels with customizable prefix templates and optional color support
- Full Support for TypeScript out of the box
- Pretty-prints any type of object uses `node:util.inspect`

## Installation

Install the package using the package manager used by your project:

```sh
npm install @foxkit/logger
pnpm add @foxkit/logger
yarn add @foxkit/logger
```

## Usage

Create your logger in a dedicated file such as `src/utils/logger.ts`:

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

The `logger` object is used to change settings:

```ts
import { log, logger } from "./utils/logger";

const oldlvl = logger.getLogLevel();
logger.setLogLevel("Debug");
log.info(`Changed log level to '${logger.getLogLevel()}'`);
```

See the [Manual](./docs/README.md) for more information
