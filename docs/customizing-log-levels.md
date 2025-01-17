# Customizing Log Levels

Instead of simply providing a name for your Log Levels you can also provide a Log Level Options object:

```ts
import col from "picocolors";

createLogger = {
  levels: [
    "Debug",
    { name: "Warn", type: "warn" },
    { name: "Error", type: "error", color: col.red },
    { name: "FATAL", type: "error", color: col.bgRed, colorMode: "full" }
  ]
  /* other options */
};
```

## Required Options

- `name`: Name of the Log Level. This name (in all lowercase) will be used for the method name of the log level on the `Logger.log` object.

## Available Options

- `template`: Override for the template. Takes default values from Logger's default template. See also [Prefix Template Options](./prefix-template-options.md)
- `color`: You can add a Color Middleware function from a colors library such as `picocolors` here to use colour in your template
  - Note: Color Middleware can be disabled using [Environment Variables](./env-variables.md#force_color) or the [Logger Settings](./logger-options.md#toggling-color-middleware)
- `colorMode`: Whether to apply the Color Middleware on the entire prefix (`"full"`) or just the `%name%` variables (`"name"`). Defaults to `"name"`.
- `type`: Which console method to use for this Log Level. Can be any of: `"log"`, `"warn"`, `"error"`. Defaults to `"log"`.
  - Note: `"warn"` uses the same output stream as `"error"` (i.e. `stderr`)
