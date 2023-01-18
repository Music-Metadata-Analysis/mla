import nextUtilities from "./ssr/utils/next";
import type { WebFrameworkVendorSSRInterface } from "@src/vendors/types/integrations/web.framework/vendor.ssr.types";

export const webFrameworkVendorSSR: WebFrameworkVendorSSRInterface = {
  utilities: nextUtilities,
};
