import { padNum } from "./padNum";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = {
  short: [
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
  ],
  long: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const ordSuffix = ["st", "nd", "rd"];

export function formatTime(
  template: string,
  time: Date,
  utc: boolean,
  hours: 12 | 24
) {
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
      case "%hours%": {
        const hour = time[utc ? "getUTCHours" : "getHours"]();
        if (hours == 24) return hour.toString();
        return (hour % 12 || 12).toString();
      }

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

      case "%ms%":
      case "%millisecond%":
      case "%milliseconds%":
        return time[
          utc ? "getUTCMilliseconds" : "getMilliseconds"
        ]().toString();

      case "%#ms%":
      case "%#millisecond%":
      case "%#milliseconds%":
        return padNum(fmt("%ms%"), 3);

      case "%day%":
        return weekdays[time[utc ? "getUTCDay" : "getDay"]()];

      case "%month_short%":
        return months.short[time[utc ? "getUTCMonth" : "getMonth"]()];

      case "%month_long%":
      case "%month_full%":
        return months.long[time[utc ? "getUTCMonth" : "getMonth"]()];

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

      case "%ampm%": {
        const hour = time[utc ? "getUTCHours" : "getHours"]();
        const out = hour >= 12 ? "pm" : "am";
        if (str == "%AMPM%") return out.toUpperCase();
        return out;
      }

      default:
        return str;
    }
  }

  return template.replace(/%#?[a-z_]+%/gi, str => fmt(str));
}
