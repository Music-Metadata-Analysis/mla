import type { VendorFlagStateType } from "../../../clients/flags/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export interface FlagVendor {
  hook: () => FlagVendorHookInterface;
  Provider: ({ children, state }: FlagVendorProviderProps) => JSX.Element;
  SSR: new () => FlagVendorSSR;
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
export interface FlagVendorSSR {
  getState: (
    identity?: string | null
  ) => VendorFlagStateType | Promise<VendorFlagStateType>;
}
