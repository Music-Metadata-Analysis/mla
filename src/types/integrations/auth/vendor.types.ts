import type { VendorProfileType } from "../../../backend/integrations/auth/vendor.types";

export type AuthVendorSessionType = {
  email: string | null;
  image: string | null;
  name: string | null;
} | null;

export interface AuthVendorClientInterface {
  getSession: () => AuthVendorSessionType | Promise<AuthVendorSessionType>;
}

export type ProfilePersistanceClientConstructorType = new (
  ...args: unknown[]
) => ProfilePersistanceClientInterface;

export interface ProfilePersistanceClientInterface {
  persistProfile(profile?: VendorProfileType): void;
}

export interface AuthVendor {
  Client: new (...args: unknown[]) => AuthVendorClientInterface;
  ApiRoutes: (...args: unknown[]) => void;
}
