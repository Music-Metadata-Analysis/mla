import NextI18NextSSR from "./ssr/next-i18next";
import type { LocaleVendorSSRInterface } from "@src/types/clients/locale/vendor.types";

const localeVendor: LocaleVendorSSRInterface = {
  Client: NextI18NextSSR,
};

export default localeVendor;
