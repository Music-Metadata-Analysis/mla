import nextI18NextHOC from "../hoc/next-i18next";
import useNextI18NextHook from "../hooks/next-i18next";
import { localeVendor } from "../vendor";

describe("localeVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(localeVendor.hook).toBe(useNextI18NextHook);
    expect(localeVendor.HOC).toBe(nextI18NextHOC);
  });
});
