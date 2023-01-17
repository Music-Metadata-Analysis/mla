import { render } from "@testing-library/react";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Page, { getStaticProps } from "@src/pages/404";
import { mockIsBuildTime } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import {
  mockStaticProps,
  mockUtilities,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.ssr.mock";

jest.mock("@src/hooks/router.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor.ssr");

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("@src/components/errors/boundary/error.boundary.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

jest.mock("@src/components/errors/display/error.display.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("getStaticProps", () => {
  it("should be the return value of staticProps", () => {
    expect(getStaticProps).toBe(mockStaticProps);
  });

  it("should be generated by a correct call to staticProps", () => {
    expect(mockUtilities.staticProps).toBeCalledTimes(1);
    expect(mockUtilities.staticProps).toBeCalledWith({ pageKey: "default" });
  });
});

describe("404", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered at build time", () => {
    beforeEach(() => {
      mockIsBuildTime.mockReturnValue(true);

      arrange();
    });

    it("should NOT call the ErrorBoundary component", () => {
      expect(ErrorBoundaryContainer).toBeCalledTimes(0);
    });

    it("should NOT call the ErrorDisplay component", () => {
      expect(ErrorDisplayContainer).toBeCalledTimes(0);
    });
  });

  describe("when rendered at run time", () => {
    beforeEach(() => {
      mockIsBuildTime.mockReturnValue(false);

      arrange();
    });

    it("should call the ErrorBoundary correctly", () => {
      expect(ErrorBoundaryContainer).toBeCalledTimes(1);
      checkMockCall(
        ErrorBoundaryContainer,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the ErrorDisplay correctly", () => {
      expect(ErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(ErrorDisplayContainer, { errorKey: "404" }, 0, [
        "handleClick",
      ]);
    });
  });
});
