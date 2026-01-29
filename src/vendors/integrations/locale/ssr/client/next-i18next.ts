import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { LocaleVendorSSRClientInterface } from "@src/vendors/types/integrations/locale/vendor.ssr.types";
const i18n = require("@src/../next-i18next.config"); // Override i18Next config directly due to Vercel Issues

class NextI18NextClientSSR implements LocaleVendorSSRClientInterface {
  protected initialLocale: string;
  protected nameSpacesRequired: string[];

  constructor(locale: unknown, nsRequired: unknown) {
    this.initialLocale = locale as string;
    this.nameSpacesRequired = nsRequired as string[];
  }

  getTranslations = async () => {
    return await serverSideTranslations(
      this.initialLocale,
      this.nameSpacesRequired,
      i18n
    );
  };
}

export default NextI18NextClientSSR;
