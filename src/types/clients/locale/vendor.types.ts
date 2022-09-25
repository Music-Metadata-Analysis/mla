import type { AppProps } from "next/app";
import type { ComponentClass, FunctionComponent } from "react";

export type tFunctionType = (key: string) => string;

export interface LocaleVendorHookInterface {
  t: tFunctionType;
}
export type translationStringType = {
  [index: string]: string | translationStringType;
};

export interface LocaleVendor {
  hook: (ns: string | undefined) => LocaleVendorHookInterface;
  HOC: (
    WrappedComponent: ComponentClass<AppProps> | FunctionComponent<AppProps>
  ) => ({ Component }: AppProps) => JSX.Element;
}

export interface LocaleVendorSSRInterface {
  getTranslations: () => unknown | Promise<unknown>;
}

export interface LocaleVendorSSR {
  Client: new (...args: unknown[]) => LocaleVendorSSRInterface;
}
