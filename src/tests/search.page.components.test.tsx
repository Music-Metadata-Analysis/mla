import { render } from "@testing-library/react";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import Search from "../components/forms/search/lastfm/search.ui.component";
import Events from "../config/events";
import routes from "../config/routes";
import Page from "../pages/search";
import mockCheckCall from "../tests/fixtures/mock.component.call";
import getPageProps from "../utils/page.props.static";

jest.mock("../utils/page.props.static", () => jest.fn());
jest.mock("../components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);
jest.mock("../components/forms/search/lastfm/search.ui.component", () =>
  createMockedComponent("Search")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "search",
      translations: ["lastfm"],
    });
  });
});

describe("Search", () => {
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
      expect(Search).toBeCalledTimes(1);
      mockCheckCall(Search, {});
    });
  });
});
