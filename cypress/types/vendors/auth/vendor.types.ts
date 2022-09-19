import type { IdentityType } from "../../../fixtures/auth";

export interface AuthVendorInterface {
  authorizationCookieName: string;
  generateToken: (identity: IdentityType) => Promise<string> | string;
}
