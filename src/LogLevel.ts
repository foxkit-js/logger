import { padStr } from "./padStr";

type ColorFormatter = (str: string) => string;

interface LogLevelOpts {
  /**
   * Name of the log level
   */
  name: string;
  /**
   * Template for console logging
   */
  msgTemplate: string;
  /**
   * Template for file logging
   */
  fileMsgTemplate?: string;
  /**
   * Pad Length for padded name template variable
   */
  padLen?: number;
  /**
   * Colour formatter to use for the name tag
   */
  color?: ColorFormatter;
}

export class LogLevel {
  #name: string;
  #msgTemplate: string;
  #fileMsgTemplate: string;
  #padLen: number;
  #color?: ColorFormatter;

  constructor({
    name,
    msgTemplate,
    fileMsgTemplate,
    padLen,
    color
  }: LogLevelOpts) {
    this.#name = name;
    this.#msgTemplate = msgTemplate;
    this.#fileMsgTemplate = fileMsgTemplate || msgTemplate;
    this.#padLen = padLen || 0;
    this.#color = color;
  }

  #processTemplateVar(str: string /* , now: Date*/) {
    switch (str) {
      case "%name%":
        return this.#name.toLowerCase();
      case "%NAME%":
        return this.#name.toUpperCase();
      case "%Name%":
        return this.#name;
      default:
        return str;
    }
  }

  #processNameVar(str: string, isFileLog?: boolean) {
    let direction: null | "left" | "center" | "right" = null;
    const tag = str.replace(/%|#/g, "");
    let val = this.#name;

    if (str.startsWith("%#")) direction = "left";
    if (str.endsWith("#%"))
      direction = direction == "left" ? "center" : "right";

    switch (tag) {
      case "name":
        val = this.#name.toLowerCase();
        break;
      case "NAME":
        val = this.#name.toUpperCase();
        break;
    }

    if (this.#color && !isFileLog) val = this.#color(val);

    return direction ? padStr(val, this.#padLen, direction) : val;
  }

  #processPrefix(template: string, isFileLog?: boolean) {
    //const now = new Date();
    return template
      .replace(/%#?(?:name|Name|NAME)#?%/g, str =>
        this.#processNameVar(str, isFileLog)
      )
      .replace(/%[a-z]+%/gi, str => this.#processTemplateVar(str /*, now*/));
  }

  processTemplate(msg: string, isFileLog?: boolean) {
    const template = isFileLog ? this.#fileMsgTemplate : this.#msgTemplate;
    const prefix = this.#processPrefix(template, isFileLog);
    return `${prefix} ${msg}`;
  }
}
