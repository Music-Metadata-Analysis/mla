import { render, screen } from "@testing-library/react";
import RateLimitedErrorConditionalDisplay from "../ratelimited.error.display.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.component";
import { MockReportClass } from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.sunburst.report.class";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

jest.mock("@src/components/errors/display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("RateLimitedErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;
  const errorType = "RatelimitedFetch";

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const arrange = () => {
    render(
      <RateLimitedErrorConditionalDisplay
        router={mockRouterHook}
        report={mockReport}
        userProperties={mockUserProperties}
      />
    );
  };

  const checkResetError = () => {
    describe("resetError", () => {
      let resetError: () => void;

      beforeEach(() => {
        resetError = jest.mocked(ErrorDisplayContainer).mock.calls[0][0]
          .resetError;
        resetError();
      });

      it("should reload the page", () => {
        expect(mockRouterHook.reload).toBeCalledTimes(1);
      });
    });
  };

  describe("when userProperties prop has a matching error", () => {
    beforeEach(() => (mockUserProperties.error = errorType));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should display the ErrorDisplayContainer component", async () => {
        expect(await screen.findByTestId("ErrorDisplayContainer")).toBeTruthy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(
          ErrorDisplayContainer,
          { errorKey: "lastfmRatelimited" },
          0,
          ["resetError"]
        );
      });

      checkResetError();
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
          { errorKey: "lastfmRatelimited" },
          0,
          ["resetError"]
        );
      });
    });
  });
});
