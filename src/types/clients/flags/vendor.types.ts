import type { VendorStateInterface } from "@src/clients/flags/vendor.types";
import type { ReactElement, JSXElementConstructor, ReactNode } from "react";

export type FlagVendorStateInterface = VendorStateInterface;

export interface FlagVendorInterface {
  hook: () => FlagVendorHookInterface;
  Provider: ({ children, state }: FlagVendorProviderProps) => JSX.Element;
}

export interface FlagVendorSSRInterface {
  Client: new () => FlagVendorSSRClientInterface;
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
  state: VendorStateInterface;
}
export interface FlagVendorSSRClientInterface {
  getState: (
    identity?: string | null
  ) => VendorStateInterface | Promise<VendorStateInterface>;
}
