import { cleanup, render } from "@testing-library/react";
import FlipCardReport from "../flip.card.report.component";
import FlipCardReportContainer from "../flip.card.report.container";
import lastfm from "@locales/lastfm.json";
import BillBoardSpinner from "@src/components/billboard/billboard.spinner/billboard.spinner.component";
import LastFMErrorDisplayContainer from "@src/components/reports/lastfm/common/error.display/error.display.container";
import { MockReportClass } from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.last.fm.report.class";
import mockFlipCardController from "@src/components/reports/lastfm/common/report.component/flip.card/controllers/__mocks__/flip.card.controller.hook.mock";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import { _t, MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockMetricsHook from "@src/hooks/__mocks__/metrics.hook.mock";
import mockImageController from "@src/hooks/controllers/__mocks__/images.controller.hook.mock";
import useLocale from "@src/hooks/locale.hook";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock(
  "@src/components/reports/lastfm/common/report.component/flip.card/controllers/flip.card.controller.hook"
);

jest.mock("@src/hooks/controllers/images.controller.hook");

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/hooks/metrics.hook");

jest.mock(
  "@src/components/reports/lastfm/common/error.display/error.display.container",
  () =>
    require("@fixtures/react/parent").createComponent("ErrorDisplayContainer")
);

jest.mock(
  "@src/components/billboard/billboard.spinner/billboard.spinner.component",
  () => require("@fixtures/react/parent").createComponent("BillBoardSpinner")
);

jest.mock("@src/components/errors/display/error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
);

jest.mock("../flip.card.report.component", () =>
  require("@fixtures/react/parent").createComponent("FlipCardReport")
);

describe("FlipCardReportContainer", () => {
  let currentLastFMHookState: userHookAsLastFMTop20AlbumReport;

  const mockUserName = "niall-byrne";
  const mockReport = new MockReportClass();
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

  const mockT = new MockUseLocale("lastfm").t;

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookStates();
  });

  const arrange = () => {
    render(
      <FlipCardReportContainer
        userName={mockUserName}
        lastfm={currentLastFMHookState}
        reportClass={MockReportClass}
      />
    );
  };

  const resetHookStates = () => {
    jest.mocked(useLocale).mockImplementation(() => ({ t: mockT }));

    currentLastFMHookState = {
      ...mockLastFMHook,
      userProperties: JSON.parse(JSON.stringify(mockLastFMHook.userProperties)),
    };
    currentLastFMHookState.userProperties.userName = mockUserName;
    currentLastFMHookState.userProperties.data.report = mockReportState;
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
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledTimes(
          1
        );
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledWith(
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
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledTimes(
          2
        );
        expect(
          currentLastFMHookState[mockReport.hookMethod]
        ).toHaveBeenNthCalledWith(1, mockUserName);
        expect(
          currentLastFMHookState[mockReport.hookMethod]
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
        expect(mockAnalyticsHook.event).toBeCalledTimes(1);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          Events.LastFM.ReportPresented(mockReport.analyticsReportType)
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
        expect(mockAnalyticsHook.event).toBeCalledTimes(0);
      });
    });
  };

  const checkErrorDisplayContainerProps = () => {
    it("should render the LastFMErrorDisplayContainer with the expected props", () => {
      expect(LastFMErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(
        LastFMErrorDisplayContainer,
        {
          report: mockReport,
          userProperties: currentLastFMHookState.userProperties,
        },
        0,
        [],
        false,
        [{ name: "report", class: MockReportClass }]
      );
    });
  };

  const checkBillBoardSpinnerProps = () => {
    it("should render the BillBoardProgressBar with the expected props", () => {
      expect(BillBoardSpinner).toBeCalledTimes(1);
      checkMockCall(BillBoardSpinner, {
        titleText: _t(lastfm[mockReport.translationKey].communication),
        visible: !currentLastFMHookState.userProperties.ready,
      });
    });
  };

  const checkFlipCardReportProps = () => {
    it("should render the SunBurstReport with the correct props", () => {
      expect(FlipCardReport).toBeCalledTimes(1);
      checkMockCall(
        FlipCardReport,
        {
          flipCardController: mockFlipCardController,
          imageIsLoaded: mockImageController.load,
          report: mockReport,
          reportStateInstance: mockReport.getEncapsulatedReportState(
            currentLastFMHookState.userProperties,
            mockT
          ),
          t: mockT,
        },
        0,
        ["update"],
        false,
        [
          { name: "report", class: MockReportClass },
          {
            name: "reportStateInstance",
            class: mockReport.encapsulationClass,
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
      currentLastFMHookState.userProperties.error = null;
    });

    describe("when the report is ready", () => {
      beforeEach(() => {
        currentLastFMHookState.userProperties.inProgress = false;
        currentLastFMHookState.userProperties.ready = true;

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
        currentLastFMHookState.userProperties.ready = false;
      });

      describe("when the report is in progress", () => {
        beforeEach(() => {
          currentLastFMHookState.userProperties.inProgress = true;
        });

        describe("when all images are not yet loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.userProperties.data.report.albums = [
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
            currentLastFMHookState.userProperties.data.report.albums = [
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
          currentLastFMHookState.userProperties.inProgress = false;
        });

        describe("when all images are not yet loaded", () => {
          beforeEach(() => {
            currentLastFMHookState.userProperties.data.report.albums = [
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
            currentLastFMHookState.userProperties.data.report.albums = [
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
      currentLastFMHookState.userProperties.error = "TimeoutFetch";

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
