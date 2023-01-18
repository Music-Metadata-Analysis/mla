import type { LocaleVendorSSRClientInterface } from "@src/vendors/types/integrations/locale/vendor.ssr.types";

class NextI18NextClientSSR implements LocaleVendorSSRClientInterface {
  protected initialLocale: string;
  protected nameSpacesRequired: string[];

  constructor(locale: unknown, nsRequired: unknown) {
    this.initialLocale = locale as string;
    this.nameSpacesRequired = nsRequired as string[];
  }

  getTranslations = async () => {
    const {
      serverSideTranslations,
    } = require("next-i18next/serverSideTranslations");
    return await serverSideTranslations(
      this.initialLocale,
      this.nameSpacesRequired
    );
  };
}

export default NextI18NextClientSSR;
