import { padNum } from "./padNum";

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

export function formatTime(template: string, utc: boolean, time: Date) {
  function fmt(str: string): string {
    switch (str.toLowerCase()) {
      case "%year%":
      case "%#year%":
        return time[utc ? "getUTCFullYear" : "getFullYear"]().toString();

      case "%month%":
        return (time[utc ? "getUTCMonth" : "getMonth"]() + 1).toString();
      case "%#month%":
        return padNum(fmt("%month%"), 2);

      case "%date%":
        return time[utc ? "getUTCDate" : "getDate"]().toString();
      case "%#date%":
        return padNum(fmt("%date%"), 2);

      case "%hour%":
      case "%hours%":
        return time[utc ? "getUTCHours" : "getHours"]().toString();

      case "%#hour%":
      case "%#hours%":
        return padNum(fmt("%hour%"), 2);

      case "%min%":
      case "%mins%":
      case "%minute%":
      case "%minutes%":
        return time[utc ? "getUTCMinutes" : "getMinutes"]().toString();

      case "%#min%":
      case "%#mins%":
      case "%#minute%":
      case "%#minutes%":
        return padNum(fmt("%min%"), 2);

      case "%sec%":
      case "%second%":
      case "%seconds%":
        return time[utc ? "getUTCSeconds" : "getSeconds"]().toString();

      case "%#sec%":
      case "%#second%":
      case "%#seconds%":
        return padNum(fmt("%sec%"), 2);

      case "%day%":
        return weekdays[time[utc ? "getUTCDay" : "getDay"]()];

      case "%month_str%":
        return months[time[utc ? "getUTCMonth" : "getMonth"]()];

      case "%date_ord%": {
        const date = time[utc ? "getUTCDate" : "getDate"]();
        const suffix =
          (4 <= date && date <= 20) || (24 <= date && date <= 30)
            ? "th"
            : ordSuffix[(date % 10) - 1];
        return date + suffix;
      }

      case "%iso%":
      case "%iso_short%":
        return `${fmt("%year%")}-${fmt("%#month%")}-${fmt("%#date%")}`;

      case "%iso_full%":
      case "%iso_long%":
        return time.toISOString();

      case "%time%":
        return `${fmt("%#hour%")}:${fmt("%#min%")}:${fmt("%#sec%")}`;

      default:
        return str;
    }
  }

  const res = template.replace(/%#?[a-z_]+%/gi, str => fmt(str));
  console.log({ time, template, res });
  return res;
}
