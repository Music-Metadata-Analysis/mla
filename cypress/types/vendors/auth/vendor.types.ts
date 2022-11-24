import type { IdentityType } from "@cypress/fixtures/spec/auth.spec";

export interface AuthVendorInterface {
  authorizationCookieName: string;
  generateToken: (identity: IdentityType) => Promise<string> | string;
}
