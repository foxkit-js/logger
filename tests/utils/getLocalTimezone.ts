import { padNum } from "../../src/padNum";

export function getLocalTimezone() {
  const total = -1 * new Date().getTimezoneOffset();
  const minutes = Math.abs(total % 60);
  const hours = Math.trunc(total / 60);
  const sign = hours < 0 ? "-" : "+";
  return `${sign}${padNum(Math.abs(hours), 2)}:${padNum(minutes, 2)}`;
}
