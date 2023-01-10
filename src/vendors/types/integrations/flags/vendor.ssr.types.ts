import type { VendorStateInterface } from "@src/vendors/integrations/flags/vendor.types";

export type FlagVendorStateInterface = VendorStateInterface;

export interface FlagVendorSSRClientInterface {
  getState: (
    identity?: string | null
  ) => VendorStateInterface | Promise<VendorStateInterface>;
}

export interface FlagVendorSSRInterface {
  Client: new () => FlagVendorSSRClientInterface;
}
