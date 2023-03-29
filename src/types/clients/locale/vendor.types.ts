import type { VendorSSRClientReturnType } from "@src/clients/locale/vendor.types";
import type { VendorAppComponentProps } from "@src/clients/web.framework/vendor.types";
import type { ComponentClass, FunctionComponent } from "react";

export type tFunctionType = (key: string) => string;

export type tContentType = {
  [index: string]: string | tContentType;
};

export type LocaleVendorSSRReturnType = VendorSSRClientReturnType;

export interface LocaleVendorHookInterface {
  t: tFunctionType;
}

export type LocaleVendorHOCType = <AppProps>(
  WrappedComponent:
    | ComponentClass<VendorAppComponentProps<AppProps>>
    | FunctionComponent<VendorAppComponentProps<AppProps>>
) => ({ Component }: VendorAppComponentProps<AppProps>) => JSX.Element;

export interface LocaleVendorInterface {
  hook: (ns: string | undefined) => LocaleVendorHookInterface;
  HOC: LocaleVendorHOCType;
}

export interface LocaleVendorSSRClientInterface {
  getTranslations: () => unknown | Promise<unknown>;
}

export interface LocaleVendorSSRInterface {
  Client: new (...args: unknown[]) => LocaleVendorSSRClientInterface;
}
