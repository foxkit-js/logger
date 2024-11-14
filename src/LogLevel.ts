import { formatTime } from "./formatTime";
import { padStr } from "./padStr";

type ColorFormatter = (str: string) => string;

interface MessageTemplate {
  template: string;
  utc?: boolean;
}

export interface LogLevelOpts {
  /**
   * Name of the log level
   */
  name: string;
  /**
   * Template for console logging
   */
  msgTemplate: string | MessageTemplate;
  /**
   * Template for file logging
   */
  fileMsgTemplate?: string | MessageTemplate;
  /**
   * Pad Length for padded name template variable
   */
  padLen?: number;
  /**
   * Colour formatter to use for the name tag
   */
  color?: ColorFormatter;
}

function toTemplateObjs(
  msgVal: string | MessageTemplate,
  fileMsgVal?: string | MessageTemplate
) {
  const msgTemplate: MessageTemplate =
    typeof msgVal == "string"
      ? { template: msgVal, utc: false }
      : { ...msgVal };

  const fileMsgTemplate: MessageTemplate = fileMsgVal
    ? typeof fileMsgVal == "string"
      ? { template: fileMsgVal, utc: false }
      : { ...fileMsgVal }
    : msgTemplate;
  return { msg: msgTemplate, file: fileMsgTemplate };
}

export class LogLevel {
  #name: string;
  #templates: ReturnType<typeof toTemplateObjs>;
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
    this.#templates = toTemplateObjs(msgTemplate, fileMsgTemplate);
    this.#padLen = padLen || 0;
    this.#color = color;
  }

  #processNameVar(str: string, isFileLog?: boolean) {
    let direction: null | "left" | "center" | "right" = null;
    const tag = str.replace(/%|#/g, "");
    let val = this.#name;

    if (str.startsWith("%#")) direction = "left";
    if (str.endsWith("#%")) {
      direction = direction == "left" ? "center" : "right";
    }

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

  #processPrefix({ template, utc }: MessageTemplate, isFileLog?: boolean) {
    return formatTime(
      template.replace(/%#?(?:name|Name|NAME)#?%/g, str =>
        this.#processNameVar(str, isFileLog)
      ),
      utc ?? false,
      new Date()
    );
  }

  processTemplate(msg: string, isFileLog?: boolean) {
    const template = this.#templates[isFileLog ? "file" : "msg"];
    const prefix = this.#processPrefix(template, isFileLog);
    return `${prefix} ${msg}`;
  }
}
