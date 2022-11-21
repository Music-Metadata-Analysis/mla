import isNextBuildTime from "../build/next";
import NextHeadShim from "../head/next";
import useNextRouter from "../hooks/next";
import NextImageShim from "../image/next";
import isNextSSR from "../ssr/next";
import webFrameworkVendor from "../vendor";

describe("webFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(webFrameworkVendor.HeadShim).toBe(NextHeadShim);
    expect(webFrameworkVendor.ImageShim).toBe(NextImageShim);
    expect(webFrameworkVendor.isBuildTime).toBe(isNextBuildTime);
    expect(webFrameworkVendor.isSSR).toBe(isNextSSR);
    expect(webFrameworkVendor.routerHook).toBe(useNextRouter);
  });
});
