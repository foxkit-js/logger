type CenterBias = "left" | "right";
type PadDirection = "left" | "center" | "right";

interface PadOpts {
  /**
   * Target Length
   */
  len: number;
  /**
   * Direction of padding: `"left"`, `"center"` or `"right"`
   */
  direction: PadDirection;
  /**
   * Bias for `"center"` direction: `"left"` or `"right"`
   */
  bias?: CenterBias;
  /**
   * Override for input string length (useful with ansi colors)
   */
  realLength?: number;
}

export function padStrCount(
  str: string,
  { len, direction, bias, realLength }: PadOpts
) {
  const strLength = realLength ?? str.length;
  const padding = { l: 0, r: 0 };
  if (strLength >= len) return padding;
  const remaining = len - strLength;

  switch (direction) {
    case "left":
      padding.l = remaining;
      break;
    case "right":
      padding.r = remaining;
      break;
    case "center":
      padding.l = Math[bias == "right" ? "ceil" : "floor"](remaining / 2);
      padding.r = remaining - padding.l;
  }

  return padding;
}

export function padStr(str: string, opts: PadOpts) {
  const { l, r } = padStrCount(str, opts);
  return " ".repeat(l) + str + " ".repeat(r);
}
