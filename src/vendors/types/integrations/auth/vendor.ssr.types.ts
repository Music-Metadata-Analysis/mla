import type { VendorStateType } from "@src/vendors/integrations/auth/vendor.types";

export type AuthVendorStateType = VendorStateType;

export interface AuthVendorSSRClientInterface {
  getSession: (
    ...args: unknown[]
  ) => AuthVendorStateType | null | Promise<AuthVendorStateType | null>;
}

export interface AuthVendorSSRInterface {
  Client: new () => AuthVendorSSRClientInterface;
}
