import NextI18NextSSR from "../ssr/client/next-i18next";
import { localeVendorSSR } from "../vendor.ssr";

describe("localeVendorSSR", () => {
  it("should be configured with the correct properties", () => {
    expect(localeVendorSSR.Client).toBe(NextI18NextSSR);
  });
});
