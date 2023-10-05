import type { VendorAppComponentProps } from "@src/vendors/integrations/web.framework/_types/vendor.specific.types";
import type { ReactNode, Reducer } from "react";

export interface WebFrameworkVendorReducerActionType {
  type: string;
}

export type WebFrameworkVendorMiddlewareType<
  STATE,
  ACTION extends WebFrameworkVendorReducerActionType
> = (reducer: Reducer<STATE, ACTION>) => Reducer<STATE, ACTION>;

export type WebFrameworkVendorMiddlewareOrReducerType<
  STATE,
  ACTION extends WebFrameworkVendorReducerActionType
> = Reducer<STATE, ACTION> | WebFrameworkVendorMiddlewareType<STATE, ACTION>;

export type WebFrameworkVendorNestedMiddlewareType<
  STATE,
  ACTION extends WebFrameworkVendorReducerActionType
> = (
  encapsulated: WebFrameworkVendorMiddlewareOrReducerType<STATE, ACTION>
) => WebFrameworkVendorMiddlewareOrReducerType<STATE, ACTION>;

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
    applyMiddleware: <
      STATE,
      ACTION extends WebFrameworkVendorReducerActionType
    >(
      originalReducer: Reducer<STATE, ACTION>,
      middlewareStack: WebFrameworkVendorMiddlewareType<STATE, ACTION>[]
    ) => Reducer<STATE, ACTION>;
    middlewares: {
      logger: <STATE, ACTION extends WebFrameworkVendorReducerActionType>(
        reducer: Reducer<STATE, ACTION>
      ) => Reducer<STATE, ACTION>;
    };
  };
}
