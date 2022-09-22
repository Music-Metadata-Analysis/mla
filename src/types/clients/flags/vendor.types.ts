import type { VendorFlagStateType } from "../../../clients/flags/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export interface FlagVendor {
  hook: () => FlagVendorHookInterface;
  Provider: ({ children, state }: FlagVendorProviderProps) => JSX.Element;
}

export interface FlagVendorSSR {
  Client: new () => FlagVendorSSRInterface;
}

export interface FlagVendorHookInterface {
  isEnabled: (flagName: string | null | undefined) => boolean;
}

export interface FlagVendorProviderProps {
  children: (
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>[]
  ) &
    ReactNode;
  state: VendorFlagStateType;
}
export interface FlagVendorSSRInterface {
  getState: (
    identity?: string | null
  ) => VendorFlagStateType | Promise<VendorFlagStateType>;
}
