import { cleanup, render } from "@testing-library/react";
import FlipCardReport from "../flip.card.report.component";
import FlipCardReportContainer from "../flip.card.report.container";
import lastfm from "@locales/lastfm.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsCollectionHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import {
  _t,
  MockUseTranslation,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import mockFlipCardController from "@src/web/reports/lastfm/generics/components/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.last.fm.query.class";
import BillBoardSpinner from "@src/web/ui/generics/components/billboard/billboard.spinner/billboard.spinner.component";
import mockImageController from "@src/web/ui/images/state/controllers/__mocks__/images.controller.hook.mock";
import type { reportHookAsLastFMTop20AlbumReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/flip.card/controllers/flip.card.controller.hook"
);

jest.mock("@src/web/ui/images/state/controllers/images.controller.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock(
  "@src/web/reports/lastfm/generics/components/error.display/error.display.container",
  () =>
    require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

jest.mock(
  "@src/web/ui/generics/components/billboard/billboard.spinner/billboard.spinner.component",
  () => require("@fixtures/react/parent").createComponent("BillBoardSpinner")
);

jest.mock("@src/web/ui/errors/components/display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
);

jest.mock("../flip.card.report.component", () =>
  require("@fixtures/react/parent").createComponent("FlipCardReport")
);

describe("FlipCardReportContainer", () => {
  let currentLastFMHookState: reportHookAsLastFMTop20AlbumReport;

  const mockUserName = "niall-byrne";
  const mockQuery = new MockQueryClass();
  const mockReportState = {
    albums: [
      {
        mbid: "Mock mbid value.",
      },
    ],
    image: [
      {
        size: "large" as const,
        "#text": "http://someurl.com",
      },
    ],
    playcount: 0,
  };

  const mockT = new MockUseTranslation("lastfm").t;

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookStates();
  });

  const arrange = () => {
    render(
      <FlipCardReportContainer
        userName={mockUserName}
        lastfm={currentLastFMHookState}
        queryClass={MockQueryClass}
      />
    );
  };

  const resetHookStates = () => {
    jest.mocked(useTranslation).mockImplementation(() => ({ t: mockT }));

    currentLastFMHookState = {
      ...mockLastFMHook,
      reportProperties: JSON.parse(
        JSON.stringify(mockLastFMHook.reportProperties)
      ),
    };
    currentLastFMHookState.reportProperties.userName = mockUserName;
    currentLastFMHookState.reportProperties.data.report = mockReportState;
  };

  const checkEffectHookImageCountReset = () => {
    describe("useEffect (image count)", () => {
      it("should clear image load count on component mount", () => {
        expect(mockImageController.reset).toBeCalledTimes(1);
        expect(mockImageController.reset).toBeCalledWith();
      });
    });
  };

  const checkEffectHookDataFetching = () => {
    describe("useEffect (data fetching)", () => {
      it("should clear the state on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
        expect(currentLastFMHookState.clear).toBeCalledWith();
      });

      it("should start a fetch on component mount", () => {
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledTimes(1);
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledWith(
          mockUserName
        );
      });

      it("should clear the report state during unmounting of the component", () => {
        cleanup();
        expect(currentLastFMHookState.clear).toBeCalledTimes(2);
      });
    });
  };

  const checkEffectHookDataFetchingAfterTimeOutError = () => {
    describe("useEffect (data fetching - after timeout error)", () => {
      it("should clear the state on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
        expect(currentLastFMHookState.clear).toBeCalledWith();
      });

      it("should start data fetching, and attempt to resume a timed out fetch", () => {
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledTimes(2);
        expect(
          currentLastFMHookState[mockQuery.hookMethod]
        ).toHaveBeenNthCalledWith(1, mockUserName);
        expect(
          currentLastFMHookState[mockQuery.hookMethod]
        ).toHaveBeenNthCalledWith(2, mockUserName);
      });

      it("should clear the report state during unmounting of the component", () => {
        cleanup();
        expect(currentLastFMHookState.clear).toBeCalledTimes(2);
      });
    });
  };

  const checkEffectHookReportIsMadeReady = () => {
    describe("useEffect (report ready)", () => {
      it("should mark the report as ready", () => {
        expect(currentLastFMHookState.ready).toBeCalledTimes(1);
        expect(currentLastFMHookState.ready).toBeCalledWith();
      });

      it("should increment the SearchMetric count", () => {
        expect(mockMetricsHook.increment).toBeCalledTimes(1);
        expect(mockMetricsHook.increment).toBeCalledWith("SearchMetric");
      });

      it("should generate the correct analytics event", () => {
        expect(mockAnalyticsCollectionHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsCollectionHook.event).toBeCalledWith(
          Events.LastFM.ReportPresented(mockQuery.analyticsReportType)
        );
      });
    });
  };

  const checkEffectHookReportIsNotMadeReady = () => {
    describe("useEffect (report ready)", () => {
      it("should NOT mark the report as ready", () => {
        expect(currentLastFMHookState.ready).toBeCalledTimes(0);
      });

      it("should NOT increment the SearchMetric count", () => {
        expect(mockMetricsHook.increment).toBeCalledTimes(0);
      });

      it("should NOT generate an analytics event", () => {
        expect(mockAnalyticsCollectionHook.event).toBeCalledTimes(0);
      });
    });
  };

  const checkErrorDisplayContainerProps = () => {
    it("should render the LastFMErrorDisplayContainer with the expected props", () => {
      expect(LastFMErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(
        LastFMErrorDisplayContainer,
        {
          query: mockQuery,
          reportProperties: currentLastFMHookState.reportProperties,
        },
        0,
        [],
        false,
        [{ name: "query", class: MockQueryClass }]
      );
    });
  };

  const checkBillBoardSpinnerProps = () => {
    it("should render the BillBoardProgressBar with the expected props", () => {
      expect(BillBoardSpinner).toBeCalledTimes(1);
      checkMockCall(BillBoardSpinner, {
        titleText: _t(lastfm[mockQuery.translationKey].communication),
        visible: !currentLastFMHookState.reportProperties.ready,
      });
    });
  };

  const checkFlipCardReportProps = () => {
    it("should render the FlipCardReport with the correct props", () => {
      expect(FlipCardReport).toBeCalledTimes(1);
      checkMockCall(
        FlipCardReport,
        {
          flipCardController: mockFlipCardController,
          imageIsLoaded: mockImageController.load,
          query: mockQuery,
          reportStateInstance: mockQuery.getEncapsulatedReportState(
            currentLastFMHookState.reportProperties,
            mockT
          ),
          t: mockT,
        },
        0,
        ["update"],
        false,
        [
          { name: "query", class: MockQueryClass },
          {
            name: "reportStateInstance",
            class: mockQuery.encapsulationClass,
          },
        ]
      );
    });
  };

  const checkFlipCardReportNotRendered = () => {
    it("should NOT render the SunBurstReport", () => {
      expect(FlipCardReport).toBeCalledTimes(0);
    });
  };

  describe("when there is no timeout error", () => {
    beforeEach(() => {
      currentLastFMHookState.reportProperties.error = null;
    });

    describe("when the report is ready", () => {
      beforeEach(() => {
        currentLastFMHookState.reportProperties.inProgress = false;
        currentLastFMHookState.reportProperties.ready = true;

        arrange();
      });

      checkEffectHookImageCountReset();
      checkEffectHookDataFetching();
      checkEffectHookReportIsNotMadeReady();
      checkErrorDisplayContainerProps();
      checkBillBoardSpinnerProps();
      checkFlipCardReportProps();
    });

    describe("when the report is NOT ready", () => {
      beforeEach(() => {
        currentLastFMHookState.reportProperties.ready = false;
      });

      describe("when the report is in progress", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.inProgress = true;
        });

        describe("when all images are not yet loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.data.report.albums = [
              { name: "mockAlbum1" },
              { name: "mockAlbum2" },
            ];
            mockImageController.count = 2;

            arrange();
          });

          checkEffectHookImageCountReset();
          checkEffectHookDataFetching();
          checkEffectHookReportIsNotMadeReady();
          checkErrorDisplayContainerProps();
          checkBillBoardSpinnerProps();
          checkFlipCardReportNotRendered();
        });

        describe("when all images are loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.data.report.albums = [
              { name: "mockAlbum1" },
              { name: "mockAlbum2" },
            ];
            mockImageController.count = 4;

            arrange();
          });

          checkEffectHookImageCountReset();
          checkEffectHookDataFetching();
          checkEffectHookReportIsNotMadeReady();
          checkErrorDisplayContainerProps();
          checkBillBoardSpinnerProps();
          checkFlipCardReportNotRendered();
        });
      });

      describe("when the report is NOT in progress", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.inProgress = false;
        });

        describe("when all images are not yet loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.data.report.albums = [
              { name: "mockAlbum1" },
              { name: "mockAlbum2" },
            ];
            mockImageController.count = 2;

            arrange();
          });

          checkEffectHookImageCountReset();
          checkEffectHookDataFetching();
          checkEffectHookReportIsNotMadeReady();
          checkErrorDisplayContainerProps();
          checkBillBoardSpinnerProps();
          checkFlipCardReportProps();
        });

        describe("when all images are loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.data.report.albums = [
              { name: "mockAlbum1" },
              { name: "mockAlbum2" },
            ];
            mockImageController.count = 4;

            arrange();
          });

          checkEffectHookImageCountReset();
          checkEffectHookDataFetching();
          checkEffectHookReportIsMadeReady();
          checkErrorDisplayContainerProps();
          checkBillBoardSpinnerProps();
          checkFlipCardReportProps();
        });
      });
    });
  });

  describe("when there is a timeout error", () => {
    beforeEach(() => {
      currentLastFMHookState.reportProperties.error = "TimeoutFetch";

      arrange();
    });

    checkEffectHookImageCountReset();
    checkEffectHookDataFetchingAfterTimeOutError();
    checkEffectHookReportIsNotMadeReady();
    checkErrorDisplayContainerProps();
    checkBillBoardSpinnerProps();
    checkFlipCardReportProps();
  });
});
