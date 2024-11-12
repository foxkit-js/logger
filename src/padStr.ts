type CenterBias = "left" | "right";
type PadDirection = "left" | "center" | "right";

export function padStr(
  str: string,
  len: number,
  direction: PadDirection,
  bias?: CenterBias
) {
  if (str.length >= len) return str;
  const remaining = len - str.length;

  let l = 0;
  let r = 0;

  switch (direction) {
    case "left":
      l = remaining;
      break;
    case "right":
      r = remaining;
      break;
    case "center":
      l = Math[bias == "right" ? "ceil" : "floor"](remaining / 2);
      r = remaining - l;
  }

  return " ".repeat(l) + str + " ".repeat(r);
}
