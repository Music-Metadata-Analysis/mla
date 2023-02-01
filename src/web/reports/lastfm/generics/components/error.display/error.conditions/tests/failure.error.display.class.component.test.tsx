import { render, screen } from "@testing-library/react";
import FetchErrorConditionalDisplay from "../failure.error.display.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockReportClass } from "@src/web/reports/lastfm/generics/components/report.class/tests/implementations/concrete.sunburst.report.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

jest.mock("@src/components/errors/display/error.display.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("FetchErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;
  const errorType = "FailureFetch";

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const arrange = () => {
    render(
      <FetchErrorConditionalDisplay
        router={mockRouterHook}
        report={mockReport}
        userProperties={mockUserProperties}
      />
    );
  };

  const checkHandleClick = () => {
    describe("handleClick", () => {
      let handleClick: () => void;

      beforeEach(() => {
        handleClick = jest.mocked(ErrorDisplayContainer).mock.calls[0][0]
          .handleClick;
        handleClick();
      });

      it("should push the router to the retryRoute", () => {
        expect(mockRouterHook.push).toBeCalledTimes(1);
        expect(mockRouterHook.push).toBeCalledWith(mockReport.retryRoute);
      });
    });
  };

  describe("when userProperties prop has a matching error", () => {
    beforeEach(() => (mockUserProperties.error = errorType));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should render the ErrorDisplayContainer component", async () => {
        expect(await screen.findByTestId("ErrorDisplayContainer")).toBeTruthy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(
          ErrorDisplayContainer,
          { errorKey: "lastfmCommunications" },
          0,
          ["handleClick"]
        );
      });

      checkHandleClick();
    });
  });

  describe("when userProperties prop has a non matching error", () => {
    beforeEach(() => (mockUserProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT display the ErrorDisplayContainer component", () => {
        expect(screen.queryByTestId("ErrorDisplayContainer")).toBeFalsy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(
          ErrorDisplayContainer,
          { errorKey: "lastfmCommunications" },
          0,
          ["handleClick"]
        );
      });
    });
  });
});
