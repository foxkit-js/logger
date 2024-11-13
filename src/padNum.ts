export function padNum(num: number | string, len: number) {
  return num.toString().padStart(len, "0");
}
