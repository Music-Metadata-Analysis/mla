import type { VendorAppComponentProps } from "@src/clients/web.framework/vendor.types";
import type { ComponentClass, FunctionComponent } from "react";

export type tFunctionType = (key: string) => string;

export interface LocaleVendorHookInterface {
  t: tFunctionType;
}

export type LocaleVendorHOCType = (
  WrappedComponent:
    | ComponentClass<VendorAppComponentProps>
    | FunctionComponent<VendorAppComponentProps>
) => ({ Component }: VendorAppComponentProps) => JSX.Element;

export type translationStringType = {
  [index: string]: string | translationStringType;
};

export interface LocaleVendor {
  hook: (ns: string | undefined) => LocaleVendorHookInterface;
  HOC: LocaleVendorHOCType;
}

export interface LocaleVendorSSRInterface {
  getTranslations: () => unknown | Promise<unknown>;
}

export interface LocaleVendorSSR {
  Client: new (...args: unknown[]) => LocaleVendorSSRInterface;
}
