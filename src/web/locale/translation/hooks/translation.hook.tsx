import { localeVendor } from "@src/vendors/integrations/locale/vendor";
import type { LocaleVendorHookInterface } from "@src/vendors/types/integrations/locale/vendor.types";

const useTranslation = (ns: string): LocaleVendorHookInterface => {
  const localeVendorHook = localeVendor.hook(ns);
  return localeVendorHook;
};

export default useTranslation;

export type LocaleHookType = ReturnType<typeof useTranslation>;
