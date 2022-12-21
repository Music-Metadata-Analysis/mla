import { mockUtilities } from "./vendor.ssr.mock";
import type { WebFrameworkVendorSSRInterface } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendorSSR: WebFrameworkVendorSSRInterface = {
  utilities: mockUtilities,
};

export default webFrameworkVendorSSR;
