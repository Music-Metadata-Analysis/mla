import pagePropsGenerator from "../page.props.server.side";
import type { GetServerSidePropsContext } from "next";

jest.mock("@src/vendors/integrations/locale/vendor.ssr", () => {
  return {
    localeVendorSSR: {
      Client: jest.fn((locale: string, translations: string[]) => ({
        getTranslations: jest.fn(() =>
          Promise.resolve({
            i18NextProps: {
              locale,
              translations,
            },
          })
        ),
      })),
    },
  };
});

type MLAPageProps = {
  props: {
    cookies: string;
    i18NextProps?: {
      locale: string;
      translations: string[];
    };
    headerProps: { pageKey: string };
  };
};

describe("pageProps", () => {
  let generatedFunction: ReturnType<typeof pagePropsGenerator>;
  let serverSideContext:
    | GetServerSidePropsContext
    | { locale: string; req: undefined };
  let returnValue: MLAPageProps;
  let expectedCookieContent: string | undefined;

  const mockCookieContent = "mockCookieValue";
  const mockLocale = "en";
  const mockDefaultTranslations = [
    "authentication",
    "errors",
    "main",
    "navbar",
  ];
  const mockTranslations = ["one", "two"];
  const mockPageKey = "test";
  const baseServerSideProps = {
    locale: mockLocale,
    req: {
      headers: {},
    },
  } as GetServerSidePropsContext;

  beforeEach(() => jest.clearAllMocks());

  const checkServerSideProps = () => {
    describe("when given a page and list of translations,", () => {
      beforeEach(() => {
        generatedFunction = pagePropsGenerator({
          pageKey: mockPageKey,
          translations: mockTranslations,
        });
      });

      it("should return a function", () => {
        expect(generatedFunction).toBeInstanceOf(Function);
      });

      describe("the returned function, when called with a locale", () => {
        beforeEach(
          async () =>
            (returnValue = (await generatedFunction(
              serverSideContext as GetServerSidePropsContext
            )) as MLAPageProps)
        );

        it("should return page props that contain the input locale", () => {
          expect(returnValue.props.i18NextProps?.locale).toBe(mockLocale);
        });

        it("should return page props that contain the correct translations", () => {
          expect(returnValue.props.i18NextProps?.translations).toStrictEqual(
            mockDefaultTranslations.concat(mockTranslations)
          );
        });

        it("should return page props that contain the correct headerProps", () => {
          expect(returnValue.props.headerProps.pageKey).toBe(mockPageKey);
        });

        it("should return page props that contain the correct cookies", () => {
          expect(returnValue.props.cookies).toBe(expectedCookieContent);
        });
      });
    });

    describe("when given a page and no list of translations,", () => {
      beforeEach(() => {
        generatedFunction = pagePropsGenerator({
          pageKey: mockPageKey,
        });
      });

      it("should return a function", () => {
        expect(generatedFunction).toBeInstanceOf(Function);
      });

      describe("the returned function", () => {
        beforeEach(
          async () =>
            (returnValue = (await generatedFunction(
              baseServerSideProps
            )) as MLAPageProps)
        );

        it("should return page props that contain the correct translations", () => {
          expect(returnValue.props.i18NextProps?.translations).toStrictEqual(
            mockDefaultTranslations
          );
        });
      });
    });
  };

  describe("with a valid request", () => {
    beforeEach(() => {
      serverSideContext = { ...baseServerSideProps };
    });

    describe("with defined cookie values", () => {
      beforeEach(() => {
        (serverSideContext as GetServerSidePropsContext).req.headers.cookie =
          mockCookieContent;
        expectedCookieContent = mockCookieContent;
      });

      checkServerSideProps();
    });

    describe("with undefined cookie values", () => {
      beforeEach(() => {
        (serverSideContext as GetServerSidePropsContext).req.headers.cookie =
          undefined;
        expectedCookieContent = "";
      });

      checkServerSideProps();
    });
  });

  describe("with an invalid request", () => {
    beforeEach(() => {
      serverSideContext = { locale: "en", req: undefined };
      expectedCookieContent = "";
    });

    checkServerSideProps();
  });
});
