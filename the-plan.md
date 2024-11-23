# Foxkit Logger

- configurable logger
  - configurable levels (may require an `"error"` level to exist)
  - configurable log prefix templates such as `"%time% - %name% -"`
    - name variable with padding to match width of longest name (left, right, center)
    - time variables with padding to two digits (such as displaying seconds as `"06"`)
- good TS support
- implements `node:util.inspect` for objects
- colour support
  - will colour the `%name%` variables
  - `node:util.inspect` already supports colour as config var

## Future Ideas

aka prevented pre-release feature creep :)

- middleware/hooks (i.e. `onLog(level, callback)`)
- file logging
  - likely support the option of using a different template for file logging
  - must disable colour in prefix and `node:util.inspect`!
  - rolling log file
    - customizable file name? same template system (sans `%name%` var)?
  - can extend `TemplateOpts` like this: https://tsplay.dev/NV81nW
- table printing util (may make separate package for this)
  - available formats: ascii, ascii (simple, i.e. `+` for corners), markdown, possibly html
- wrapper for main functions
  - can run async main function of a script and catch any fatal errors
  - uses configurable level (such as `"error"` or `"fatal"`) to log caught errors
  - returns Promise, so `then(() => log.debug("Completed"))` could be chained for example :)

## Misc notes

- Any objects passed should either be recreated or frozen to prevent changes
  - opts for `node:util.inspect` should likely just be sealed/frozen?❓
- need a custom util for merging opts and a default, see: https://ieji.de/@mitsunee/113499661365435282
  - TL;DR: there's a funny behaviour with spread where `undefined` set as a value replaces "legitimate" values, which TS ignores.
  - Not an issue if the user has "exactOptionalPropertyTypes" set to `true`, but this is not the default
    - may enable this in configs in the lib template?

## Env Variables

Environment Variables can be used to override settings passed to `createLogger`:

| var         | Description                     |
| :---------- | :------------------------------ |
| `LOG_LEVEL` | Overrides the default log level |

## API

### Formatter system

Replaces variables [word here] by being surrounded by `%` characters such as `%hours%`. Padding may be available for some variables using `#`.

| var               | Description                                         | Padding/Capitalization                 | Aliases                       |
| :---------------- | :-------------------------------------------------- | :------------------------------------- | :---------------------------- |
| `"%year%"`        | Current year                                        | `%#year%` padded to 4 digits           |
| `"%month%"`       | Current month as number                             | `%#month%` padded to 2 digits          |
| `"%date%"`        | Current day of month as number                      | `"%#date%"` paddded to 2 digits        |
| `"%hour%"`        | Current hour                                        | `"%#hour%"` padded to 2 digits         | `hours`                       |
| `"%min%"`         | Current minute                                      | `"%#min%"` padded to 2 digits          | `mins`, `minute`, `minutes`   |
| `"%sec%"`         | Current second                                      | `"%#sec%"` padded to 2 digits          | `second`, `seconds`           |
| `"%ms%"`          | Current millisecond                                 | `%#ms%` padded to 3 digits             | `millisecond`, `milliseconds` |
| `"%day%"`         | Current weekday as string such as`"Wed"`            |
| `"%month_short%"` | Current month as string such as`"Dec"`              |
| `"%month_long%"`  | Current month as string such as`"December"`         |                                        | `month_full`                  |
| `"%date_ord%": `  | Current day of the month as string such as`"25th"`  |
| `"%iso%"`         | Current iso date as string such as`"2024-12-25"`    |                                        | `iso_short`                   |
| `"%iso_full%"`    | Full ISO string such as`"2024-12-25T18:06:12.889Z"` |                                        | `iso_long`                    |
| `"%time%"`        | Alias of`"%#hour%:%#min%:%#sec"`                    |
| `"%ampm%"`        | Current day period (i.e.`"am"` or `"pm"`).          | Can be capitalized by using `"%AMPM%"` |

Note: Some usecases may extend the formatter with additional variables such as `%name%` in Log Level Prefixes.

```ts
interface TemplateOpts {
  template: string;
  utc?: boolean; // whether to use UTC or local tz when logging, default: false
  hours?: 12 | 24; // hour notation system, default: 24
}

type Template = TemplateOpts | string;
type ResolvedTemplateOpts = Required<TemplateOpts>;
```

### Logger

- main interface to create a new logger, possibly singletonfactory?❓
- Definitely want this to be synchronous to better support cjs.

```ts
interface LevelOpts<Name extends string> {
  name: Name;
  template?: ResolvedTemplateOpts; // template override, uses default template as base
  color?: (str: string) => string; // color middleware
  colorMode?: "name" | "full"; // whether to color name or entire prefix, default: name
  type?: "log" | "warn" | "error"; // console method to use, default: "log"
}

interface LoggerOpts<Level extends string> {
  levels: Array<Level | LevelOpts<Level>>;
  defaultLevel: Level; // this can be overriden via env variable `LOG_LEVEL`
  template: Template; // Default Template to use for every level without one
  inspectOpt?: InspectOptions; // imported from "util"
}

function createLogger<Level extends string>(
  opts: LoggerOpts<Level>
): Logger<Level>;

interface Logger<Level extends string> {
  logger: LoggerUtils<Level>;
  log: Record<Lowercase<Level>, LogFn>;
}
```

### Logger.logger

Settings utilites:

- `setLogLevel` ability to change current log level (or revert to default?)
- `getLogLevel` ability to read current log level (or use getter/setter?)

### Logger.log

Contains log method for each level

```ts
import type { InspectOptions } from "util";

type LogFn = (arg: any, opts?: InspectOptions) => void;
```

- accepts single value with optional overrides for `InspectOptions`
- check position in levels array and compare against current level
  - if current level is larger `LogFn` should be a noop
- All logs start with prefix as per template
  - uses default template as base, replaces values from override as provided
- if output contains at least one instance of `"\n"` add newline after prefix, space character otherwise
- Strings are simply printed
- other Primitives objects are handled with `node:util.inspect`
  - that also adds color to numbers, bools etc if color is enabled
  - uses settings as per `LoggerOpts`

## TODO:

- write a proper README
