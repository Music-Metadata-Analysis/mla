import { localeVendor } from "../vendor";
import nextI18NextHOC from "../web/hoc/next-i18next";
import useNextI18NextHook from "../web/hooks/next-i18next";

describe("localeVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(localeVendor.hook).toBe(useNextI18NextHook);
    expect(localeVendor.HOC).toBe(nextI18NextHOC);
    expect(Object.keys(localeVendor).length).toBe(2);
  });
});
