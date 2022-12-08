import localeVendorSSR from "@src/clients/locale/vendor.ssr";
import type { LocaleVendorSSRReturnType } from "@src/types/clients/locale/vendor.types";
import type { GetStaticProps } from "next";

interface pagePropsGeneratorInterface {
  pageKey: string;
  translations?: string[];
}

const pagePropsGenerator = ({
  pageKey,
  translations = [],
}: pagePropsGeneratorInterface) => {
  const getPageProps: GetStaticProps = async (props) => {
    const translator = new localeVendorSSR.Client(
      props.locale,
      ["authentication", "errors", "main", "navbar"].concat(translations)
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
