import { render, screen } from "@testing-library/react";
import NoListensErrorConditionalDisplay from "../nolistens.error.display.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockReportClass } from "@src/web/reports/lastfm/generics/components/report.class/tests/implementations/concrete.sunburst.report.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

jest.mock("@src/components/errors/display/error.display.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("NoListensErrorConditionalDisplay", () => {
  let mockUserProperties: LastFMUserStateBase;
  let mockReport: MockReportClass;

  beforeEach(() => {
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockReport = new MockReportClass();
  });

  const getUserState = () =>
    mockUserProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;

  const arrange = () => {
    render(
      <NoListensErrorConditionalDisplay
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

  describe("when the user has no listening data in their report", () => {
    beforeEach(() => {
      mockUserProperties.userName = "niall-byrne";
      mockUserProperties.ready = true;
      getUserState().content = [];
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("when the report queryUserHasData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockReport.queryUserHasNoData(mockUserProperties))
        );

        it("should return true", () => {
          expect(received).toBe(true);
        });
      });

      it("should display the ErrorDisplayContainer component", async () => {
        expect(await screen.findByTestId("ErrorDisplayContainer")).toBeTruthy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(
          ErrorDisplayContainer,
          { errorKey: "userWithNoListens" },
          0,
          ["handleClick"]
        );
      });

      checkHandleClick();
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

      describe("the report queryUserHasNoData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockReport.queryUserHasNoData(mockUserProperties))
        );

        it("should return false", () => {
          expect(received).toBe(false);
        });
      });

      it("should NOT display the ErrorDisplayContainer component", () => {
        expect(screen.queryByTestId("ErrorDisplayContainer")).toBeFalsy();
      });

      it("should render the ErrorDisplayContainer component the correct props", () => {
        checkMockCall(
          ErrorDisplayContainer,
          { errorKey: "userWithNoListens" },
          0,
          ["handleClick"]
        );
      });
    });
  });
});
