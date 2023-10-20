import { render, screen } from "@testing-library/react";
import NotFoundErrorConditionalDisplay from "../notfound.error.display.class.component";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

jest.mock("@src/web/ui/errors/components/display/error.display.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("NotFoundErrorConditionalDisplay", () => {
  let mockReportProperties: LastFMReportStateBase;
  let mockQuery: MockQueryClass;
  const errorType = "NotFoundFetch";

  beforeEach(() => {
    mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockQuery = new MockQueryClass();
  });

  const arrange = () => {
    render(
      <NotFoundErrorConditionalDisplay
        router={mockRouterHook}
        query={mockQuery}
        reportProperties={mockReportProperties}
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
        expect(mockRouterHook.push).toBeCalledWith(mockQuery.retryRoute);
      });
    });
  };

  describe("when reportProperties prop has a matching error", () => {
    beforeEach(() => (mockReportProperties.error = errorType));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should display the ErrorDisplayContainer component", async () => {
        expect(await screen.findByTestId("ErrorDisplayContainer")).toBeTruthy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(ErrorDisplayContainer, { errorKey: "userNotFound" }, 0, [
          "handleClick",
        ]);
      });

      checkHandleClick();
    });
  });

  describe("when reportProperties prop has a non matching error", () => {
    beforeEach(() => (mockReportProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT display the ErrorDisplayContainer component", () => {
        expect(screen.queryByTestId("ErrorDisplayContainer")).toBeFalsy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(ErrorDisplayContainer, { errorKey: "userNotFound" }, 0, [
          "handleClick",
        ]);
      });
    });
  });
});
