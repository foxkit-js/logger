# Planned Features

aka prevented pre-release feature creep :)

- more middleware/hooks (i.e. `onLog(level, callback)`)
- file logging
  - likely support the option of using a different template for file logging
  - must disable colour in prefix and `node:util.inspect`!
  - rolling log file
    - customizable file name? same template system (sans `%name%` var)?
  - can extend `TemplateOpts` like this: https://tsplay.dev/NV81nW
  - `logger.printRaw()` and `printRawError()` to print a message without prefix in both cli and file
- table printing util (may make separate package for this)
  - available formats: ascii, ascii (simple, i.e. `+` for corners), tabs (kinda like `columns`), markdown, possibly html
