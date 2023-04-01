import type {
  VendorSSRClientReturnType,
  VendorHOCType,
} from "@src/clients/locale/vendor.types";

export type tFunctionType = (key: string) => string;

export type tContentType = {
  [index: string]: string | tContentType;
};

export type LocaleVendorSSRReturnType = VendorSSRClientReturnType;

export interface LocaleVendorHookInterface {
  t: tFunctionType;
}

export type LocaleVendorHOCType = VendorHOCType;

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
