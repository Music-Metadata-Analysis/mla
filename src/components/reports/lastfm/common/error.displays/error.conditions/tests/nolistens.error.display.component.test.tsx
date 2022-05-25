import { render, screen } from "@testing-library/react";
import MockStage2Report from "../../../../../../../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "../../../../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../../../../tests/fixtures/mock.router";
import ErrorDisplay from "../../../../../../errors/display/error.display.component";
import { MockReportClass } from "../../../sunburst.report/tests/fixtures/mock.sunburst.report.class";
import NoListensErrorConditionalDisplay from "../nolistens.error.display.component";
import type { PlayCountByArtistReportInterface } from "../../../../../../../types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../../../types/integrations/base.types";
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

describe("NoListensErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const getUserState = () =>
    mockUserProperties.data.report
      .playCountByArtist as AggregateBaseReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;

  const arrange = () => {
    render(
      <NoListensErrorConditionalDisplay
        router={mockRouter}
        report={mockReport}
        userProperties={mockUserProperties}
      />
    );
  };

  describe("when the user has no listening data in their report", () => {
    beforeEach(() => {
      mockUserProperties.userName = "niall-byrne";
      mockUserProperties.ready = true;
      getUserState().content = [];
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("the report queryUserHasData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockReport.queryUserHasData(mockUserProperties))
        );

        it("should return false", () => {
          expect(received).toBe(false);
        });
      });

      it("should render the error display component", async () => {
        expect(await screen.findByTestId("MockComponent")).toBeTruthy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "userWithNoListens" }, 0, [
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

  describe("when the user has listening data in their report", () => {
    beforeEach(() => {
      mockUserProperties.userName = "niall-byrne";
      mockUserProperties.ready = true;
      getUserState().content = [
        { name: "The Cure", playcount: 100, albums: [], fetched: true },
      ];
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("the report queryUserHasData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockReport.queryUserHasData(mockUserProperties))
        );

        it("should return true", () => {
          expect(received).toBe(true);
        });
      });

      it("should NOT render the error display component", async () => {
        expect(screen.queryByTestId("MockComponent")).toBeFalsy();
      });

      it("should render with the correct props", async () => {
        checkMockCall(ErrorDisplay, { errorKey: "userWithNoListens" }, 0, [
          "resetError",
        ]);
      });
    });
  });
});
