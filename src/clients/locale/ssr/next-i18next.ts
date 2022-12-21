import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { LocaleVendorSSRClientInterface } from "@src/types/clients/locale/vendor.types";

class NextI18NextSSR implements LocaleVendorSSRClientInterface {
  protected initialLocale: string;
  protected nameSpacesRequired: string[];

  constructor(locale: unknown, nsRequired: unknown) {
    this.initialLocale = locale as string;
    this.nameSpacesRequired = nsRequired as string[];
  }

  getTranslations = async () => {
    return await serverSideTranslations(
      this.initialLocale,
      this.nameSpacesRequired
    );
  };
}

export default NextI18NextSSR;
