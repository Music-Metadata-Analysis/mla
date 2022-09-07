import type { VendorFlagStateType } from "../../../clients/flags/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export interface FlagVendor {
  hook: () => FlagVendorHookInterface;
  Provider: ({ state, children }: FlagVendorProviderProps) => JSX.Element;
  SSR: new () => FlagVendorSSR;
}

export interface FlagVendorHookInterface {
  isEnabled: (flagName: string | null | undefined) => boolean;
}

export interface FlagVendorProviderProps {
  state: VendorFlagStateType;
  children: (
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>[]
  ) &
    ReactNode;
}
export interface FlagVendorSSR {
  fetchState: () => VendorFlagStateType | Promise<VendorFlagStateType>;
}