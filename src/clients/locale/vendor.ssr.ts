import NextI18NextSSR from "./ssr/next-i18next";
import type { LocaleVendorSSR } from "@src/types/clients/locale/vendor.types";

const localeVendor: LocaleVendorSSR = {
  Client: NextI18NextSSR,
};

export default localeVendor;
