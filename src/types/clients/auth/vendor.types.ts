import type { VendorAuthStateType } from "../../../clients/auth/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export interface AuthVendor {
  hook: () => AuthVendorHookInterface;
  Provider: ({ session, children }: AuthVendorProviderProps) => JSX.Element;
  SSR: new () => AuthVendorSSR;
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
export interface AuthVendorSSR {
  getSession: (
    ...args: unknown[]
  ) => VendorAuthStateType | null | Promise<VendorAuthStateType | null>;
}
