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

export type AuthVendorProfilePersistanceClientConstructorType = new (
  ...args: unknown[]
) => AuthVendorProfilePersistanceClientInterface;

export interface AuthVendorProfilePersistanceClientInterface {
  persistProfile(profile?: VendorProfileType): void;
}

export interface AuthVendorInterface {
  config: VendorConfigType;
  Client: new (...args: unknown[]) => AuthVendorClientInterface;
  ApiRoutes: (...args: unknown[]) => unknown;
}
