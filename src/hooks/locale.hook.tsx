import { localeVendor } from "@src/vendors/integrations/locale/vendor";
import type { LocaleVendorHookInterface } from "@src/vendors/types/integrations/locale/vendor.types";

const useLocale = (ns: string): LocaleVendorHookInterface => {
  const localeVendorHook = localeVendor.hook(ns);
  return localeVendorHook;
};

export default useLocale;

export type LocaleHookType = ReturnType<typeof useLocale>;
