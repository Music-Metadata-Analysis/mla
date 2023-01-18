import type { VendorAppComponentProps } from "@src/vendors/integrations/web.framework/_types/vendor.specific.types";
import type { ReactNode } from "react";

export type WebFrameworkVendorAppComponentProps<T> = VendorAppComponentProps<T>;

export interface WebFrameworkVendorRouterHookInterface {
  back: () => void;
  path: string;
  push(url: string): void;
  reload(): void;
  handlers: WebFrameworkVendorRouterHandlersInterface;
}

export interface WebFrameworkVendorRouterHandlersInterface {
  addRouteChangeHandler(cb: (url: string) => void): void;
  removeRouteChangeHandler(cb: (url: string) => void): void;
}

export interface WebFrameworkVendorImageShimProps {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface WebFrameworkVendorInterface {
  HeadShim: (props: { children: ReactNode }) => JSX.Element;
  ImageShim: (props: WebFrameworkVendorImageShimProps) => JSX.Element;
  isBuildTime: () => boolean;
  isSSR: () => boolean;
  routerHook: () => WebFrameworkVendorRouterHookInterface;
}
