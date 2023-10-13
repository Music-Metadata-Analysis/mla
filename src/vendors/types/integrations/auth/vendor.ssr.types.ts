import type { VendorStateType } from "@src/vendors/integrations/auth/_types/vendor.specific.types";

export type AuthVendorStateType = VendorStateType;

export interface AuthVendorSSRClientInterface {
  getSession: (
    ...args: unknown[]
  ) => AuthVendorStateType | null | Promise<AuthVendorStateType | null>;
}

export interface AuthVendorSSRInterface {
  Client: new () => AuthVendorSSRClientInterface;
}
