# Prefix Template Options

Templates can be customized further by providing a `TemplateOpts` object instead of a string:

```ts
const myTemplate = {
  template: "%#name% -",
  utc: true,
  hours: 24
} satisfies TemplateOpts;
```

## Required Options

- `template`: The Prefix Template string

## Available Options

- `utc`: Whether to use UTC (`true`) or local timezone (`false`) with this template. Defaults to `false`
- `hours`: Whether to use `12` or `24` hour notation with this template. Defaults to `24`.

Note: When using a `TemplateOpts` object in Log Level options as an override the default values will be taken from the Logger's default template!

## Template Variables

The templating system uses variables surronded by `%` characters.

### Padding

Optionally `#` characters may be used before and after the variable name to indicate padding direction (`%#left%`. `%#centered#%`, `%right#%`). Some numerical values may support left-aligned padding by adding leading zeroes such as `%#hour%` (example: `06`).

### Log Level Name

When used in Log Level Prefix Templates the `%Name%` variable is available to print the name of the Log Level in the Prefix. Padding in all directions is supported, additionaly the name can be transformed to all lowercase (`%name%`) or all uppercase (`%NAME%`) letters.

### Date & Time Values

Time is determined when the template is used. The following variables are available:

| Variable          | Description                                                                                    | Padding/Capitalization          |
| :---------------- | :--------------------------------------------------------------------------------------------- | :------------------------------ |
| `"%year%"`        | Current year                                                                                   | `%#year%` padded to 4 digits    |
| `"%month%"`       | Current month as number                                                                        | `%#month%` padded to 2 digits   |
| `"%date%"`        | Current day of month as number                                                                 | `"%#date%"` paddded to 2 digits |
| `"%hour%"`        | Current hour<br>Aliases:<ul><li>`%hours%`</li></ul>                                            | `"%#hour%"` padded to 2 digits  |
| `"%min%"`         | Current minute<br>Aliases:<ul><li>`%mins%`</li><li>`%minute%`</li><li>`%minutes%`</li></ul>    | `"%#min%"` padded to 2 digits   |
| `"%sec%"`         | Current second<br>Aliases:<ul><li>`%second%`</li><li>`%seconds%`</li></ul>                     | `"%#sec%"` padded to 2 digits   |
| `"%ms%"`          | Current millisecond<br>Aliases:<ul><li>`%millisecond%`</li><li>`%milliseconds%`</li></ul>      | `%#ms%` padded to 3 digits      |
| `"%day%"`         | Current weekday as string such as `"Wed"`                                                      |
| `"%month_short%"` | Current month as string such as `"Dec"`                                                        |
| `"%month_long%"`  | Current month as string such as `"December"`<br>Aliases:<ul><li>`%month_full%`</li></ul>       |
| `"%date_ord%": `  | Current day of the month as string such as `"25th"`                                            |
| `"%iso%"`         | Current iso date as string such as `"2024-12-25"`<br>Aliases:<ul><li>`%iso_short%`</li></ul>   |
| `"%iso_full%"`    | Full ISO string such as `"2024-12-25T18:06:12.889Z"`<br>Aliases:<ul><li>`%iso_long%`</li></ul> |
| `"%time%"`        | Alias of`"%#hour%:%#min%:%#sec"`                                                               |
| `"%ampm%"`        | Current day period (i.e.`"am"` or `"pm"`).<br>Can be capitalized by using `"%AMPM%"`           |
