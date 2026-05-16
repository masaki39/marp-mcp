import {
  getActiveTheme,
  getAvailableThemeNames,
  getTheme,
  setActiveTheme,
} from "../index.js";
import { getLayout, listLayouts } from "../../tools/list_layouts.js";

describe("theme manager", () => {
  afterEach(() => {
    setActiveTheme("default");
  });

  it("defaults to the Marp default theme", () => {
    expect(getActiveTheme().name).toBe("default");
  });

  it("exposes all registered themes", () => {
    const names = getAvailableThemeNames();
    const expectedThemes = ["default", "gaia", "uncover"];
    expect(names).toEqual(expect.arrayContaining(expectedThemes));
    for (const themeName of expectedThemes) {
      expect(getTheme(themeName)).toBeDefined();
    }
  });

  it("adds lead styling support in Gaia title layout", () => {
    setActiveTheme("gaia");
    const layout = getLayout("title");
    expect(layout?.className).toBe("lead");
    expect(layout?.template({ heading: "Hello" })).toContain("_class: lead");
  });
});

async function getLayoutNamesFromTool(): Promise<string[]> {
  const response = await listLayouts({});
  const payload = JSON.parse(response.content[0].text) as {
    layouts: Array<{ name: string }>;
  };
  return payload.layouts.map((layout) => layout.name);
}
