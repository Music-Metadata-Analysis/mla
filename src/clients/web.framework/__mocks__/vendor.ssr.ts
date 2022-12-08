import { mockUtilities } from "./vendor.ssr.mock";
import type { WebFrameworkVendorSSR } from "@src/types/clients/web.framework/vendor.types";

const webFrameworkVendorSSR: WebFrameworkVendorSSR = {
  utilities: mockUtilities,
};

export default webFrameworkVendorSSR;
