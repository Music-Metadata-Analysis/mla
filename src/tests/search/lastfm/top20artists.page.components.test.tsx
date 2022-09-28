import { render } from "@testing-library/react";
import lastfmTranslations from "@locales/lastfm.json";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import SearchUI from "@src/components/search/lastfm/search.ui";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import Page, { getStaticProps } from "@src/pages/search/lastfm/top20artists";
import mockCheckCall from "@src/tests/fixtures/mock.component.call";
import getPageProps from "@src/utils/page.props.static";

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("@src/utils/page.props.static", () =>
  jest.fn(() => "mockStaticProps")
);

jest.mock("@src/components/errors/boundary/error.boundary.component", () =>
  require("@fixtures/react").createComponent("ErrorBoundary")
);

jest.mock("@src/components/search/lastfm/search.ui", () =>
  require("@fixtures/react").createComponent("SearchUI")
);

describe("getStaticProps", () => {
  it("should be the return value of pagePropsGenerator", () => {
    expect(getStaticProps).toBe("mockStaticProps");
  });

  it("should be generated by a correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "search",
      translations: ["lastfm"],
    });
  });
});

describe("SearchTopArtists", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary correctly", () => {
      expect(ErrorBoundary).toBeCalledTimes(1);
      mockCheckCall(
        ErrorBoundary,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the ErrorDisplay correctly", () => {
      expect(SearchUI).toBeCalledTimes(1);
      mockCheckCall(
        SearchUI,
        {
          route: routes.reports.lastfm.top20artists,
          title: _t(lastfmTranslations.top20Artists.searchTitle),
        },
        0,
        ["t"]
      );
    });
  });
});
