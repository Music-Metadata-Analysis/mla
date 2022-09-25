import localeVendor from "@src/clients/locale/vendor";
import type { LocaleVendorHookInterface } from "@src/types/clients/locale/vendor.types";

const useLocale = (ns: string): LocaleVendorHookInterface => {
  const localeVendorHook = localeVendor.hook(ns);
  return localeVendorHook;
};

export default useLocale;
