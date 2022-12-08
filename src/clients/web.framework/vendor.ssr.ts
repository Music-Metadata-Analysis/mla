import nextUtilities from "./utils/next";
import type { WebFrameworkVendorSSR } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendorSSR = {
  utilities: nextUtilities,
};

export default webFrameworkVendor;
