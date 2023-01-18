import nextI18NextHOC from "./web/hoc/next-i18next";
import useNextI18NextHook from "./web/hooks/next-i18next";
import type { LocaleVendorInterface } from "@src/vendors/types/integrations/locale/vendor.types";

export const localeVendor: LocaleVendorInterface = {
  HOC: nextI18NextHOC,
  hook: useNextI18NextHook,
};
