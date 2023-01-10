import type { VendorStateType } from "@src/vendors/integrations/auth/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export type AuthVendorStateType = VendorStateType;

export type AuthVendorServiceType =
  | "facebook"
  | "github"
  | "google"
  | "spotify";

export type AuthVendorSessionType = {
  name?: string;
  email?: string;
  image?: string;
  group?: string;
  oauth: AuthVendorServiceType;
} | null;
export type AuthVendorStatusType =
  | "authenticated"
  | "unauthenticated"
  | "processing";

export interface AuthVendorHookInterface {
  user: AuthVendorSessionType;
  status: AuthVendorStatusType;
  signIn: (provider: AuthVendorServiceType) => void;
  signOut: () => void;
}

export interface AuthVendorProviderProps {
  session?: AuthVendorStateType;
  children: (
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>[]
  ) &
    ReactNode;
}

export interface AuthVendorInterface {
  hook: () => AuthVendorHookInterface;
  Provider: ({ session, children }: AuthVendorProviderProps) => JSX.Element;
}
