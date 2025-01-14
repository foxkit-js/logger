# Configuration via Enviroment Variables

## LOG_LEVEL

The `LOG_LEVEL` environment variable can be used to override your default log level. It takes the name of any of your log levels as a value.

## FORCE_COLOR

Node.js' `FORCE_COLOR` enviroment variable can be used to force setting colour support. For the purposes of Color Middleware in Foxkit Logger the following values are recognized:

- `0`, `false`: indicate no color support
- any number, `true`, empty string (`''`): indicate color support

See [Node Documentation - Command-line API](https://nodejs.org/docs/latest-v22.x/api/cli.html#force_color1-2-3) for more information

## NO_COLOR / NODE_DISABLE_COLORS

As per Node.js implementation setting either `NO_COLOR` or `NODE_DISABLE_COLORS` disables Color Middleware unless [`FORCE_COLOR`](#force_color) is used.

See also:

- [Node Documentation - Command-line API](https://nodejs.org/docs/latest-v22.x/api/cli.html#node_disable_colors1)
- [no-color.org](https://no-color.org/)
