import isNextBuildTime from "./build/next";
import useNextRouter from "./hooks/next";
import NextImageShim from "./image/next";
import isNextSSR from "./ssr/next";
import type { WebFrameworkVendor } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendor = {
  ImageShim: NextImageShim,
  isBuildTime: isNextBuildTime,
  isSSR: isNextSSR,
  routerHook: useNextRouter,
};

export default webFrameworkVendor;
