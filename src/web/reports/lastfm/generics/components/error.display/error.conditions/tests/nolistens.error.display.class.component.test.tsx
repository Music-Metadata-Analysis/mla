import { render, screen } from "@testing-library/react";
import NoListensErrorConditionalDisplay from "../nolistens.error.display.class.component";
import MockStage2Report from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

jest.mock("@src/web/ui/errors/components/display/error.display.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

describe("NoListensErrorConditionalDisplay", () => {
  let mockReportProperties: LastFMReportStateBase;
  let mockQuery: MockQueryClass;

  beforeEach(() => {
    mockReportProperties = JSON.parse(JSON.stringify(MockStage2Report));
    mockQuery = new MockQueryClass();
  });

  const getReportState = () =>
    mockReportProperties.data.report
      .playCountByArtist as LastFMAggregateReportResponseInterface<
      PlayCountByArtistReportInterface[]
    >;

  const arrange = () => {
    render(
      <NoListensErrorConditionalDisplay
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
        expect(mockRouterHook.push).toHaveBeenCalledTimes(1);
        expect(mockRouterHook.push).toHaveBeenCalledWith(mockQuery.retryRoute);
      });
    });
  };

  describe("when the user has no listening data in their report", () => {
    beforeEach(() => {
      mockReportProperties.userName = "niall-byrne";
      mockReportProperties.ready = true;
      getReportState().content = [];
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("when the report queryUserHasData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockQuery.queryUserHasNoData(mockReportProperties))
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
      mockReportProperties.userName = "niall-byrne";
      mockReportProperties.ready = true;
      getReportState().content = [
        { name: "The Cure", playcount: 100, albums: [], fetched: true },
      ];
    });

    describe("when instantiated with a concrete implementation", () => {
      beforeEach(() => arrange());

      describe("the report queryUserHasNoData method", () => {
        let received: boolean;

        beforeEach(
          () => (received = mockQuery.queryUserHasNoData(mockReportProperties))
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
