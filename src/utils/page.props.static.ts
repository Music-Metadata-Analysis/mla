import localeVendorSSR from "@src/clients/locale/vendor.ssr";
import type { LocaleVendorSSRReturnType } from "@src/clients/locale/vendor.types";

interface pagePropsGeneratorInterface {
  pageKey: string;
  translations?: string[];
}

interface getPagePropsInterface {
  locale: string;
}

const pagePropsGenerator = ({
  pageKey,
  translations = [],
}: pagePropsGeneratorInterface) => {
  const getPageProps = async ({ locale }: getPagePropsInterface) => {
    const translator = new localeVendorSSR.Client(
      locale,
      ["authentication", "main", "navbar"].concat(translations)
    );
    const translationData =
      (await translator.getTranslations()) as LocaleVendorSSRReturnType;

    return {
      props: {
        ...translationData,
        headerProps: { pageKey },
      },
    };
  };
  return getPageProps;
};

export default pagePropsGenerator;
