import type { VendorAppComponentProps } from "@src/vendors/integrations/web.framework/_types/vendor.specific.types";
import type { ReactNode, Reducer } from "react";

export interface VendorActionType {
  type: string;
}

export type VendorMiddlewareType<STATE, ACTION extends VendorActionType> = (
  reducer: Reducer<STATE, ACTION>
) => Reducer<STATE, ACTION>;

export type VendorMiddlewareOrReducerType<
  STATE,
  ACTION extends VendorActionType
> = Reducer<STATE, ACTION> | VendorMiddlewareType<STATE, ACTION>;

export type VendorNestedType<STATE, ACTION extends VendorActionType> = (
  encapsulated: VendorMiddlewareOrReducerType<STATE, ACTION>
) => VendorMiddlewareOrReducerType<STATE, ACTION>;

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
  reducers: {
    applyMiddleware: <STATE, ACTION extends VendorActionType>(
      originalReducer: Reducer<STATE, ACTION>,
      middlewareStack: VendorMiddlewareType<STATE, ACTION>[]
    ) => Reducer<STATE, ACTION>;
    middlewares: {
      logger: <STATE, ACTION extends VendorActionType>(
        reducer: Reducer<STATE, ACTION>
      ) => Reducer<STATE, ACTION>;
    };
  };
}
