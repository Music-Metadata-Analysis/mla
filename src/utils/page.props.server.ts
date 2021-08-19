import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { BaseRouter } from "next/dist/shared/lib/router/router";

interface pagePropsGeneratorInterface {
  pageKey: string;
  translations?: string[];
}

interface getPagePropsInterface {
  locale: string;
  query: BaseRouter["query"];
}

const pagePropsGenerator = ({
  pageKey,
  translations = [],
}: pagePropsGeneratorInterface) => {
  const getPageProps = async ({ locale, query }: getPagePropsInterface) => {
    return {
      props: {
        ...(await serverSideTranslations(
          locale,
          ["main", "navbar"].concat(translations)
        )),
        query,
        headerProps: { pageKey },
      },
    };
  };
  return getPageProps;
};

export default pagePropsGenerator;
