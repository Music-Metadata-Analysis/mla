import NextI18NextSSR from "./ssr/next-i18next";
import type { LocaleVendorSSRInterface } from "@src/vendors/types/integrations/locale/vendor.ssr.types";

export const localeVendorSSR: LocaleVendorSSRInterface = {
  Client: NextI18NextSSR,
};
