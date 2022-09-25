import nextI18NextHOC from "./hoc/next-i18next";
import useNextI18NextHook from "./hooks/next-i18next";
import type { LocaleVendor } from "@src/types/clients/locale/vendor.types";

const localeVendor: LocaleVendor = {
  HOC: nextI18NextHOC,
  hook: useNextI18NextHook,
};

export default localeVendor;
