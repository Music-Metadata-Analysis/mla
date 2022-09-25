import { useTranslation } from "next-i18next";
import type { LocaleVendorHookInterface } from "@src/types/clients/locale/vendor.types";

const useNextI18NextHook = (
  ns: string | undefined
): LocaleVendorHookInterface => {
  const { t } = useTranslation(ns);

  return {
    t,
  };
};

export default useNextI18NextHook;
