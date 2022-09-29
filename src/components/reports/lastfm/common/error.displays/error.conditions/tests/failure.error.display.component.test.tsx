import { render, screen } from "@testing-library/react";
import FetchErrorConditionalDisplay from "../failure.error.display.component";
import ErrorDisplay from "@src/components/errors/display/error.display.component";
import { MockReportClass } from "@src/components/reports/lastfm/common/sunburst.report/tests/implementations/concrete.sunburst.report.class";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

jest.mock("@src/components/errors/display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
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

  describe("when userProperties prop has a matching error", () => {
    beforeEach(() => (mockUserProperties.error = errorType));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should render the error display component", async () => {
        expect(await screen.findByTestId("ErrorDisplay")).toBeTruthy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "lastfmCommunications" }, 0, [
          "resetError",
        ]);
      });

      describe("resetError", () => {
        let resetError: () => void;

        beforeEach(() => {
          resetError = jest.mocked(ErrorDisplay).mock.calls[0][0].resetError;
          resetError();
        });

        it("should push the router to the retryRoute", () => {
          expect(mockRouterHook.push).toBeCalledTimes(1);
          expect(mockRouterHook.push).toBeCalledWith(mockReport.retryRoute);
        });
      });
    });
  });

  describe("when userProperties prop has a non matching error", () => {
    beforeEach(() => (mockUserProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT render the error display component", async () => {
        expect(screen.queryByTestId("ErrorDisplay")).toBeFalsy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "lastfmCommunications" }, 0, [
          "resetError",
        ]);
      });
    });
  });
});
