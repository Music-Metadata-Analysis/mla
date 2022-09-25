import type { IdentityType } from "@cypress/fixtures/auth";

export interface AuthVendorInterface {
  authorizationCookieName: string;
  generateToken: (identity: IdentityType) => Promise<string> | string;
}
