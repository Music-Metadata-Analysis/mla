import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface pagePropsGeneratorInterface {
  pageKey: string;
  translations?: string[];
}

interface getStaticPropsInterface {
  locale: string;
}

const pagePropsGenerator = ({
  pageKey,
  translations = [],
}: pagePropsGeneratorInterface) => {
  const getPageProps = async ({ locale }: getStaticPropsInterface) => {
    return {
      props: {
        ...(await serverSideTranslations(
          locale,
          ["main", "navbar"].concat(translations)
        )),
        headerProps: { pageKey },
      },
    };
  };
  return getPageProps;
};

export default pagePropsGenerator;
