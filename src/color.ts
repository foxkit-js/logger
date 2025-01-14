export const colorSupport = {
  stdout: process.stdout?.hasColors?.() ?? false,
  stderr: process.stderr?.hasColors?.() ?? false
};

/**
 * Checks whether color is supported by an output stream
 * @param stream Either `"log"` (stdout) or `"error"` (stderr), if omitted the value for `"log"` is given
 * @returns boolean, true if color is supported
 */
export function getColorSupport(stream?: "log" | "error") {
  return colorSupport[stream == "error" ? "stderr" : "stdout"];
}

class ColorToggle {
  supported: boolean;
  private enabled?: boolean;

  constructor(stream: "stdout" | "stderr") {
    this.supported = colorSupport[stream];
  }

  toggle(state: boolean | "reset") {
    if (!this.supported) return;
    if (state == "reset") {
      this.enabled = this.supported;
      return;
    }
    this.enabled = state;
  }

  get isEnabled() {
    return this.enabled ?? this.supported;
  }
}

export function createColorToggles() {
  const toggles = {
    log: new ColorToggle("stdout"),
    error: new ColorToggle("stderr")
  };

  /**
   * Enables, disables or resets whether color is enabled for an output stream
   * @param state Either boolean value, or `"reset"` to reset to default
   * @param stream Either `"log"` (stdout) or `"error"` (stderr), if omitted `"log"` is changed
   */
  function toggleColor(state: boolean | "reset", stream?: "log" | "error") {
    if (stream == "error") return toggles.error.toggle(state);
    toggles.log.toggle(state);
  }

  return { toggles, toggleColor };
}
