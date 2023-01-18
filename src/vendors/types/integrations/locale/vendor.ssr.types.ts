import type { VendorSSRClientReturnType } from "@src/vendors/integrations/locale/_types/vendor.specific.types";

export type LocaleVendorSSRReturnType = VendorSSRClientReturnType;

export interface LocaleVendorSSRClientInterface {
  getTranslations: () => unknown | Promise<unknown>;
}

export interface LocaleVendorSSRInterface {
  Client: new (...args: unknown[]) => LocaleVendorSSRClientInterface;
}
