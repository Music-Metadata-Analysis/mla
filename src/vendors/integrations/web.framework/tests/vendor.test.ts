import { webFrameworkVendor } from "../vendor";
import isNextBuildTime from "../web/build/next";
import NextHeaderComponent from "../web/head/next";
import useNextRouter from "../web/hooks/next";
import NextImageShim from "../web/image/next";
import reducerLoggingMiddleware from "../web/reducers/middlewares/reducer.logger";
import applyMiddleware from "../web/reducers/reducer.middleware";
import isNextSSR from "../web/ssr/next";

describe("webFrameworkVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(webFrameworkVendor.HeadShim).toBe(NextHeaderComponent);
    expect(webFrameworkVendor.ImageShim).toBe(NextImageShim);
    expect(webFrameworkVendor.isBuildTime).toBe(isNextBuildTime);
    expect(webFrameworkVendor.isSSR).toBe(isNextSSR);
    expect(webFrameworkVendor.routerHook).toBe(useNextRouter);
    expect(webFrameworkVendor.reducers.applyMiddleware).toBe(applyMiddleware);
    expect(webFrameworkVendor.reducers.middlewares).toStrictEqual({
      logger: reducerLoggingMiddleware,
    });
    expect(Object.keys(webFrameworkVendor).length).toBe(6);
    expect(Object.keys(webFrameworkVendor.reducers).length).toBe(2);
    expect(Object.keys(webFrameworkVendor.reducers.middlewares).length).toBe(1);
  });
});
