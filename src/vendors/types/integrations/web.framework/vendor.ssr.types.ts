import type { VendorUtilities } from "@src/vendors/integrations/web.framework/_types/vendor.specific.types";

export type WebFrameworkVendorSSRUtilitiesInterface = VendorUtilities;

export interface WebFrameworkVendorSSRInterface {
  utilities: WebFrameworkVendorSSRUtilitiesInterface;
}
