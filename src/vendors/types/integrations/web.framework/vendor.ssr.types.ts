import type { VendorUtilities } from "@src/vendors/integrations/web.framework/vendor.types";

export type WebFrameworkVendorSSRUtilitiesInterface = VendorUtilities;

export interface WebFrameworkVendorSSRInterface {
  utilities: WebFrameworkVendorSSRUtilitiesInterface;
}
