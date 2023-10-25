import type { IdentityType } from "@cypress/fixtures/spec/auth.cy";

export interface AuthVendorInterface {
  authorizationCookieName: string;
  generateToken: (identity: IdentityType) => Promise<string> | string;
}
