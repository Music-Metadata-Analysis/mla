import type { VendorHOCType } from "@src/vendors/integrations/locale/vendor.types";

export type tFunctionType = (key: string) => string;

export type tContentType = {
  [index: string]: string | tContentType;
};

export interface LocaleVendorHookInterface {
  t: tFunctionType;
}

export type LocaleVendorHOCType = VendorHOCType;

export interface LocaleVendorInterface {
  hook: (ns: string | undefined) => LocaleVendorHookInterface;
  HOC: LocaleVendorHOCType;
}
