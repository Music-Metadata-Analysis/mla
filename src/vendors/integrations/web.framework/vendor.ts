import isNextBuildTime from "./build/next";
import NextHeaderComponent from "./head/next";
import useNextRouter from "./hooks/next";
import NextImageShim from "./image/next";
import isNextSSR from "./ssr/next";
import type { WebFrameworkVendorInterface } from "@src/vendors/types/integrations/web.framework/vendor.types";

export const webFrameworkVendor: WebFrameworkVendorInterface = {
  HeadShim: NextHeaderComponent,
  ImageShim: NextImageShim,
  isBuildTime: isNextBuildTime,
  isSSR: isNextSSR,
  routerHook: useNextRouter,
};
