import type { appWithTranslation } from "next-i18next";
import type { serverSideTranslations } from "next-i18next/serverSideTranslations";

export type VendorSSRClientReturnType = ReturnType<
  typeof serverSideTranslations
>;

export type VendorHOCType = typeof appWithTranslation;
