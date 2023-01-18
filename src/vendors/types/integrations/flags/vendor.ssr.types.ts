import type { VendorStateInterface } from "@src/vendors/integrations/flags/_types/vendor.specific.types";

export type FlagVendorStateInterface = VendorStateInterface;

export interface FlagVendorSSRClientInterface {
  getState: (
    identity?: string | null
  ) => VendorStateInterface | Promise<VendorStateInterface>;
}

export interface FlagVendorSSRInterface {
  Client: new () => FlagVendorSSRClientInterface;
}
