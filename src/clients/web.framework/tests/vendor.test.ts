import isNextBuildTime from "../build/next";
import useNextRouter from "../hooks/next";
import NextImageShim from "../image/next";
import webFrameworkVendor from "../vendor";

describe("webFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(webFrameworkVendor.ImageShim).toBe(NextImageShim);
    expect(webFrameworkVendor.isBuildTime).toBe(isNextBuildTime);
    expect(webFrameworkVendor.routerHook).toBe(useNextRouter);
  });
});
