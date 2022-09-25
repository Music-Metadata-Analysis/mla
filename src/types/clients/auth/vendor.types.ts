import type { VendorAuthStateType } from "@src/clients/auth/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export interface AuthVendor {
  hook: () => AuthVendorHookInterface;
  Provider: ({ session, children }: AuthVendorProviderProps) => JSX.Element;
}

export interface AuthVendorSSR {
  Client: new () => AuthVendorSSRInterface;
}

export type AuthServiceType = "facebook" | "github" | "google" | "spotify";
export type AuthSessionType = {
  name?: string;
  email?: string;
  image?: string;
  group?: string;
  oauth: AuthServiceType;
} | null;
export type AuthStatusType = "authenticated" | "unauthenticated" | "processing";

export interface AuthVendorHookInterface {
  user: AuthSessionType;
  status: AuthStatusType;
  signIn: (provider: AuthServiceType) => void;
  signOut: () => void;
}

export interface AuthVendorProviderProps {
  session?: VendorAuthStateType;
  children: (
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>[]
  ) &
    ReactNode;
}
export interface AuthVendorSSRInterface {
  getSession: (
    ...args: unknown[]
  ) => VendorAuthStateType | null | Promise<VendorAuthStateType | null>;
}
