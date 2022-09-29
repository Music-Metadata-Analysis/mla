import isNextBuildTime from "./build/next";
import useNextRouter from "./hooks/next";
import NextImageShim from "./image/next";
import type { WebFrameworkVendor } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendor = {
  ImageShim: NextImageShim,
  isBuildTime: isNextBuildTime,
  routerHook: useNextRouter,
};

export default webFrameworkVendor;
