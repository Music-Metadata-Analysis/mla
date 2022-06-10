import { render, screen } from "@testing-library/react";
import MockStage2Report from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "../../../../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../../../../tests/fixtures/mock.router";
import ErrorDisplay from "../../../../../../errors/display/error.display.component";
import { MockReportClass } from "../../../sunburst.report/tests/fixtures/mock.sunburst.report.class";
import NotFoundErrorConditionalDisplay from "../notfound.error.display.component";
import type { LastFMUserStateBase } from "../../../../../../../types/user/state.types";

jest.mock("../../../../../../errors/display/error.display.component", () =>
  createMockedComponent("MockComponent")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require(".../../../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("NotFoundErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;
  const errorType = "NotFoundFetch";

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const arrange = () => {
    render(
      <NotFoundErrorConditionalDisplay
        router={mockRouter}
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
        expect(await screen.findByTestId("MockComponent")).toBeTruthy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "userNotFound" }, 0, [
          "resetError",
        ]);
      });

      describe("resetError", () => {
        let resetError: () => void;

        beforeEach(() => {
          resetError = (ErrorDisplay as jest.Mock).mock.calls[0][0].resetError;
          resetError();
        });

        it("should push the router to the retryRoute", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(mockReport.retryRoute);
        });
      });
    });
  });

  describe("when userProperties prop has a non matching error", () => {
    beforeEach(() => (mockUserProperties.error = "DataPointFailureFetch"));

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      it("should NOT render the error display component", async () => {
        expect(screen.queryByTestId("MockComponent")).toBeFalsy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "userNotFound" }, 0, [
          "resetError",
        ]);
      });
    });
  });
});
