import type {
  VendorConfigType,
  VendorProfileType,
} from "@src/backend/integrations/auth/vendor.types";

export type AuthVendorSessionType = {
  email: string | null;
  image: string | null;
  name: string | null;
  group: string | null;
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
  config: VendorConfigType;
  Client: new (...args: unknown[]) => AuthVendorClientInterface;
  ApiRoutes: (...args: unknown[]) => unknown;
}
