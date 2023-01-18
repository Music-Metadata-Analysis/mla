import { webFrameworkVendor } from "../vendor";
import isNextBuildTime from "../web/build/next";
import NextHeaderComponent from "../web/head/next";
import useNextRouter from "../web/hooks/next";
import NextImageShim from "../web/image/next";
import isNextSSR from "../web/ssr/next";

describe("webFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(webFrameworkVendor.HeadShim).toBe(NextHeaderComponent);
    expect(webFrameworkVendor.ImageShim).toBe(NextImageShim);
    expect(webFrameworkVendor.isBuildTime).toBe(isNextBuildTime);
    expect(webFrameworkVendor.isSSR).toBe(isNextSSR);
    expect(webFrameworkVendor.routerHook).toBe(useNextRouter);
  });
});
