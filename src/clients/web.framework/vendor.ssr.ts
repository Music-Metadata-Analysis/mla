import nextUtilities from "./utils/next";
import type { WebFrameworkVendorSSRInterface } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendor: WebFrameworkVendorSSRInterface = {
  utilities: nextUtilities,
};

export default webFrameworkVendor;
