import type { serverSideTranslations } from "next-i18next/serverSideTranslations";

export type LocaleVendorSSRReturnType = ReturnType<
  typeof serverSideTranslations
>;
