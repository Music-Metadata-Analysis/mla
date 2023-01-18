import { localeVendorSSR } from "@src/vendors/integrations/locale/vendor.ssr";
import type { LocaleVendorSSRReturnType } from "@src/vendors/types/integrations/locale/vendor.ssr.types";
import type { GetServerSideProps } from "next";

interface pagePropsGeneratorInterface {
  pageKey: string;
  translations?: string[];
}

const pagePropsGenerator = ({
  pageKey,
  translations = [],
}: pagePropsGeneratorInterface) => {
  const getPageProps: GetServerSideProps = async ({ locale, req }) => {
    const translator = new localeVendorSSR.Client(
      locale,
      ["authentication", "errors", "main", "navbar"].concat(translations)
    );
    const translationData =
      (await translator.getTranslations()) as LocaleVendorSSRReturnType;

    return {
      props: {
        ...translationData,
        cookies: req?.headers.cookie ?? "",
        headerProps: { pageKey },
      },
    };
  };
  return getPageProps;
};

export default pagePropsGenerator;
