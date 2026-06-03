import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  clearExternalStyles,
  getAvailableStyleNames,
  getExternalStyles,
  getStyle,
  registerExternalStyle,
  setActiveStyle,
  getActiveStyle,
} from "../index.js";
import type { StyleDefinition } from "../../themes/types.js";

function makeDef(name: string, css = "/* css */"): StyleDefinition {
  return {
    name,
    description: `External style discovered from /tmp/${name}.css`,
    compatibleThemes: [],
    css,
    layouts: {},
  };
}

describe("registerExternalStyle", () => {
  beforeEach(() => {
    clearExternalStyles();
    setActiveStyle("default");
  });

  it("registers an external style and makes it discoverable", () => {
    const ok = registerExternalStyle(makeDef("alpha"), "/tmp/alpha.css");
    expect(ok).toBe(true);

    expect(getStyle("alpha")?.name).toBe("alpha");
    expect(getAvailableStyleNames()).toContain("alpha");
    expect(getExternalStyles()).toHaveLength(1);
  });

  it("allows the external style to be activated", () => {
    registerExternalStyle(makeDef("alpha", "section { color: red; }"), "/tmp/alpha.css");
    setActiveStyle("alpha");
    expect(getActiveStyle().name).toBe("alpha");
    expect(getActiveStyle().css).toBe("section { color: red; }");
  });

  it("rejects collisions with built-in style names", () => {
    const ok = registerExternalStyle(makeDef("default"), "/tmp/default.css");
    expect(ok).toBe(false);
    expect(getStyle("default")?.css).toBe("");
    expect(getExternalStyles()).toHaveLength(0);
  });

  it("replaces a previously registered external when the same name registers again", () => {
    registerExternalStyle(makeDef("alpha", "first"), "/tmp/a.css");
    const ok = registerExternalStyle(makeDef("alpha", "second"), "/tmp/b.css");

    expect(ok).toBe(true);
    expect(getExternalStyles()).toHaveLength(1);
    expect(getStyle("alpha")?.css).toBe("second");
    expect(getExternalStyles()[0].source).toBe("/tmp/b.css");
  });

  it("throws when activating an unknown style name", () => {
    expect(() => setActiveStyle("nonexistent")).toThrow(/Unknown style/);
  });
});
