import type { serverSideTranslations } from "next-i18next/serverSideTranslations";

export type VendorSSRClientReturnType = ReturnType<
  typeof serverSideTranslations
>;
