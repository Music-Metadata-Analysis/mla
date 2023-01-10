import nextI18NextHOC from "./hoc/next-i18next";
import useNextI18NextHook from "./hooks/next-i18next";
import type { LocaleVendorInterface } from "@src/vendors/types/integrations/locale/vendor.types";

export const localeVendor: LocaleVendorInterface = {
  HOC: nextI18NextHOC,
  hook: useNextI18NextHook,
};
