import { padNum } from "./padNum";
import { padStr } from "./padStr";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const ordSuffix = ["st", "nd", "rd"];

type ColorFormatter = (str: string) => string;

interface MessageTemplate {
  template: string;
  utc?: boolean;
}

interface LogLevelOpts {
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
  #now: Date;

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
    this.#now = new Date();
  }

  #processTemplateVar(str: string, utc: boolean): string {
    const now = this.#now;
    const r = (str: string) => this.#processTemplateVar(`%${str}%`, utc); // call this method recursively

    switch (str.toLowerCase()) {
      case "%year%":
      case "%#year%":
        return now[utc ? "getUTCFullYear" : "getFullYear"]().toString();

      case "%month%":
        return (now[utc ? "getUTCMonth" : "getMonth"]() + 1).toString();
      case "%#month%":
        return padNum(r("month"), 2);

      case "%date%":
        return now[utc ? "getUTCDate" : "getDate"]().toString();
      case "%#date%":
        return padNum(r("date"), 2);

      case "%hour%":
      case "%hours%":
        return now[utc ? "getUTCHours" : "getHours"]().toString();

      case "%#hour%":
      case "%#hours%":
        return padNum(r("hour"), 2);

      case "%min%":
      case "%mins%":
      case "%minute%":
      case "%minutes%":
        return now[utc ? "getUTCMinutes" : "getMinutes"]().toString();

      case "%#min%":
      case "%#mins%":
      case "%#minute%":
      case "%#minutes%":
        return padNum(r("min"), 2);

      case "%sec%":
      case "%second%":
      case "%seconds%":
        return now[utc ? "getUTCSeconds" : "getSeconds"]().toString();

      case "%#sec%":
      case "%#second%":
      case "%#seconds%":
        return padNum(r("sec"), 2);

      case "%day%":
        return weekdays[now[utc ? "getUTCDay" : "getDay"]()];

      case "%month_str%":
        return months[now[utc ? "getUTCMonth" : "getMonth"]()];

      case "%date_ord%": {
        const date = now[utc ? "getUTCDate" : "getDate"]();
        const suffix =
          (4 <= date && date <= 20) || (24 <= date && date <= 30)
            ? "th"
            : ordSuffix[(date % 10) - 1];
        return date + suffix;
      }

      case "%iso%":
      case "%iso_short%":
        return `${r("year")}-${r("#month")}-${r("#date")}`;

      case "%iso_full%":
      case "%iso_long%":
        return now.toISOString();

      case "%time%":
        return `${r("#hour")}:${r("#min")}:${r("#sec")}`;

      default:
        return str;
    }
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
    this.#now = new Date();

    return template
      .replace(/%#?(?:name|Name|NAME)#?%/g, str =>
        this.#processNameVar(str, isFileLog)
      )
      .replace(/%#?[a-z_]+%/gi, str =>
        this.#processTemplateVar(str, utc ?? false)
      );
  }

  processTemplate(msg: string, isFileLog?: boolean) {
    const template = this.#templates[isFileLog ? "file" : "msg"];
    const prefix = this.#processPrefix(template, isFileLog);
    return `${prefix} ${msg}`;
  }
}
