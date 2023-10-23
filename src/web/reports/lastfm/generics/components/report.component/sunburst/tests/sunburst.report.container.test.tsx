import { cleanup, render } from "@testing-library/react";
import mockSunburstCacheControllerHook from "../controllers/__mocks__/sunburst.report.cache.controller.hook.mock";
import mockSunBurstLayoutControllerHook from "../controllers/__mocks__/sunburst.report.layout.controller.hook.mock";
import useSunBurstLayoutController from "../controllers/sunburst.report.layout.controller.hook";
import SunBurstReport from "../sunburst.report.component";
import SunBurstReportContainer from "../sunburst.report.container";
import lastfm from "@locales/lastfm.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import {
  mockAuthHook,
  mockUserProfile,
} from "@src/vendors/integrations/auth/__mocks__/vendor.mock";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";
import mockSunBurstControllerHookValues from "@src/web/reports/generics/state/controllers/sunburst/__mocks__/sunburst.controller.hook.mock";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import useSunBurstCacheController from "@src/web/reports/lastfm/generics/components/report.component/sunburst/controllers/sunburst.report.cache.controller.hook";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import BillBoardProgressBar from "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";
import type { reportHookAsLastFMPlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook", () =>
  jest.fn()
);

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock(
  "@src/web/reports/generics/state/controllers/sunburst/sunburst.controller.hook"
);

jest.mock("../controllers/sunburst.report.cache.controller.hook");

jest.mock("../controllers/sunburst.report.layout.controller.hook");

jest.mock(
  "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component",
  () =>
    require("@fixtures/react/parent").createComponent("BillBoardProgressBar")
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/error.display/error.display.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "LastFMErrorDisplayContainer"
    )
);

jest.mock("../sunburst.report.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstReport")
);

describe("SunBurstReportContainer", () => {
  let currentLastFMHookState: reportHookAsLastFMPlayCountByArtistReport;

  const mockQuery = new MockQueryClass();
  const mockUserName = "mockUsername";
  const mockLastFmT = new MockUseTranslation("lastfm").t;
  const mockSunBurstT = new MockUseTranslation("sunburst").t;

  const resumableReportErrors: [ReportStateInterface["error"]][] = [
    ["TimeoutFetch"],
    ["FailureRetrieveCachedReport"],
    ["DataPointFailureFetch"],
    ["DataPointNotFoundFetch"],
    ["DataPointTimeoutFetch"],
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookStates();
  });

  const arrange = () => {
    render(
      <SunBurstReportContainer
        userName={mockUserName}
        lastfm={currentLastFMHookState}
        queryClass={MockQueryClass}
      />
    );
  };

  const resetHookStates = () => {
    currentLastFMHookState =
      mockLastFMHook as reportHookAsLastFMPlayCountByArtistReport;

    currentLastFMHookState.reportProperties = JSON.parse(
      JSON.stringify(mockLastFMHook.reportProperties)
    );

    jest
      .mocked(useTranslation)
      .mockReturnValueOnce({ t: mockLastFmT })
      .mockReturnValueOnce({ t: mockSunBurstT });

    mockAuthHook.user = { ...mockUserProfile };
  };

  const checkInstantiateHooks = () => {
    it("should instantiate the useAnalytics hook as expected", () => {
      expect(useAnalytics).toBeCalledTimes(1);
      expect(useAnalytics).toBeCalledWith();
    });

    it("should instantiate the useTranslation hook as expected", () => {
      expect(useTranslation).toBeCalledTimes(2);
      expect(useTranslation).toBeCalledWith("lastfm");
      expect(useTranslation).toBeCalledWith("sunburst");
    });

    it("should instantiate the useMetrics hook as expected", () => {
      expect(useMetrics).toBeCalledTimes(1);
      expect(useMetrics).toBeCalledWith();
    });

    it("should instantiate the useSunBurstCacheController hook as expected", () => {
      expect(useSunBurstCacheController).toBeCalledTimes(1);
      expect(useSunBurstCacheController).toBeCalledWith({
        queryClass: MockQueryClass,
        sourceName: "lastfm",
        userName: mockUserName,
      });
    });

    it("should instantiate the useSunBurstLayoutController hook as expected", () => {
      expect(useSunBurstLayoutController).toBeCalledTimes(1);
      expect(useSunBurstLayoutController).toBeCalledWith();
    });
  };

  const checkEffectHookDataFetchingWithCacheRetrieval = () => {
    describe("useEffect (data fetching)", () => {
      it("should attempt to retrieve a cached report", () => {
        expect(mockSunburstCacheControllerHook.read).toBeCalledTimes(1);
        expect(mockSunburstCacheControllerHook.read).toBeCalledWith();
      });

      it("should clear the state and start a fetch on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
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

  const checkEffectHookDataFetchingWithNoCacheRetrieval = () => {
    describe("useEffect (data fetching)", () => {
      it("should attempt to retrieve a cached report", () => {
        expect(mockSunburstCacheControllerHook.read).toBeCalledTimes(1);
        expect(mockSunburstCacheControllerHook.read).toBeCalledWith();
      });

      it("should clear the state but NOT start a fetch on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
        expect(currentLastFMHookState.clear).toBeCalledWith();
      });

      it("should clear the report state during unmounting of the component", () => {
        cleanup();
        expect(currentLastFMHookState.clear).toBeCalledTimes(2);
      });
    });
  };

  const checkEffectHookDataFetchingWithResume = () => {
    describe("useEffect (report resume)", () => {
      it("should clear the state and start a fetch on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledWith(
          mockUserName
        );
      });

      it("should resume the building the report", () => {
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledTimes(2);
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

  const checkEffectHookNodeSelection = ({
    analyticsCallCount,
  }: {
    analyticsCallCount: number;
  }) => {
    describe("useEffect (node selection)", () => {
      it("should trigger an analytics event for the selected node", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(analyticsCallCount);
        expect(mockAnalyticsHook.event).toBeCalledWith(
          mockQuery
            .getEncapsulatedNode(mockSunBurstControllerHookValues.node.selected)
            .getDrawerEvent()
        );
      });

      it("should trigger a layout update", () => {
        expect(mockSunBurstLayoutControllerHook.update).toBeCalledTimes(1);
        expect(mockSunBurstLayoutControllerHook.update).toBeCalledWith();
      });
    });
  };

  const checkEffectHookNodeSelectionNoUpdate = ({
    analyticsCallCount,
  }: {
    analyticsCallCount: number;
  }) => {
    describe("useEffect (node selection)", () => {
      it("should NOT trigger an analytics event for the selected node", () => {
        expect(mockAnalyticsHook.event).toBeCalledTimes(analyticsCallCount);
        expect(mockAnalyticsHook.event).not.toBeCalledWith(
          mockQuery
            .getEncapsulatedNode(mockSunBurstControllerHookValues.node.selected)
            .getDrawerEvent()
        );
      });

      it("should NOT trigger a layout update", () => {
        expect(mockSunBurstLayoutControllerHook.update).toBeCalledTimes(0);
      });
    });
  };

  const checkEffectHookReportReadyWithCacheWriting = ({
    analyticsCallCount,
  }: {
    analyticsCallCount: number;
  }) => {
    it("should write the report to the remote cache", () => {
      expect(mockSunburstCacheControllerHook.write).toBeCalledTimes(1);
      expect(mockSunburstCacheControllerHook.write).toBeCalledWith();
    });

    it("should NOT update the report state to ready", () => {
      expect(currentLastFMHookState.ready).toBeCalledTimes(0);
    });

    it("should NOT increment the search metric", () => {
      expect(mockMetricsHook.increment).toBeCalledTimes(0);
    });

    it("should NOT trigger an analytics event for report presentation", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(analyticsCallCount);
      expect(mockAnalyticsHook.event).not.toBeCalledWith(
        Events.LastFM.ReportPresented(mockQuery.analyticsReportType)
      );
    });
  };

  const checkEffectHookReportReadyWithNoCacheWriting = ({
    analyticsCallCount,
  }: {
    analyticsCallCount: number;
  }) => {
    it("should update the report state to ready", () => {
      expect(currentLastFMHookState.ready).toBeCalledTimes(1);
      expect(currentLastFMHookState.ready).toBeCalledWith();
    });

    it("should increment the search metric", () => {
      expect(mockMetricsHook.increment).toBeCalledTimes(1);
      expect(mockMetricsHook.increment).toBeCalledWith("SearchMetric");
    });

    it("should trigger an analytics event for report presentation", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(analyticsCallCount);
      expect(mockAnalyticsHook.event).toBeCalledWith(
        Events.LastFM.ReportPresented(mockQuery.analyticsReportType)
      );
    });
  };

  const checkErrorDisplayContainerProps = () => {
    it("should call the LastFMErrorDisplayContainer with the expected props", () => {
      expect(LastFMErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(LastFMErrorDisplayContainer, {
        query: mockQuery,
        reportProperties: currentLastFMHookState.reportProperties,
      });
    });
  };

  const checkBillBoardProgressBarProps = () => {
    it("should call the BillBoardProgressBar with the expected props", () => {
      expect(BillBoardProgressBar).toBeCalledTimes(1);
      checkMockCall(BillBoardProgressBar, {
        details: mockQuery.getProgressDetails(
          currentLastFMHookState.reportProperties,
          mockSunBurstT
        ),
        titleText: _t(lastfm[mockQuery.translationKey].communication),
        value: mockQuery.getProgressPercentage(
          currentLastFMHookState.reportProperties
        ),
        visible: !currentLastFMHookState.reportProperties.ready,
      });
    });

    it("should translate the BillBoardProgressBar title correctly", () => {
      expect(mockLastFmT).toBeCalledWith("playCountByArtist.communication");
    });
  };

  const checkSunBurstReportProps = () => {
    it("should render the SunBurstReport with the correct props", () => {
      expect(SunBurstReport).toBeCalledTimes(1);
      checkMockCall(
        SunBurstReport,
        {
          encapsulatedReportState: mockQuery.getEncapsulatedReportState(
            currentLastFMHookState.reportProperties
          ),
          lastFMt: mockLastFmT,
          query: mockQuery,
          sunBurstT: mockSunBurstT,
          sunBurstController: mockSunBurstControllerHookValues,
          sunBurstLayoutController: mockSunBurstLayoutControllerHook,
          visible: currentLastFMHookState.reportProperties.ready,
        },
        0,
        ["update"],
        false,
        [
          {
            name: "encapsulatedReportState",
            class: mockQuery.encapsulationClass,
          },
        ]
      );
    });
  };

  describe("when report cache retrieval is bypassed", () => {
    beforeEach(() => {
      mockSunburstCacheControllerHook.read.mockResolvedValue({
        bypassed: true,
      });
    });

    describe("when report cache writing is bypassed", () => {
      beforeEach(() => {
        mockSunburstCacheControllerHook.write.mockResolvedValue({
          bypassed: true,
        });
      });

      describe("when the data state is ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.inProgress = false;
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = true;
            currentLastFMHookState.reportProperties.error = null;

            arrange();
          });

          checkInstantiateHooks();
          checkEffectHookDataFetchingWithCacheRetrieval();
          checkEffectHookNodeSelection({ analyticsCallCount: 2 });
          checkEffectHookReportReadyWithNoCacheWriting({
            analyticsCallCount: 2,
          });
          checkErrorDisplayContainerProps();
          checkBillBoardProgressBarProps();
          checkSunBurstReportProps();
        });
      });

      describe("when the data state is NOT ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = false;
          });

          describe.each(resumableReportErrors)(
            "and is resumable (%s)",
            (resumableCondition) => {
              beforeEach(() => {
                currentLastFMHookState.reportProperties.inProgress = false;
                currentLastFMHookState.reportProperties.error =
                  resumableCondition;
                arrange();
              });

              checkInstantiateHooks();
              checkEffectHookDataFetchingWithResume();
              checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
              checkErrorDisplayContainerProps();
              checkBillBoardProgressBarProps();
              checkSunBurstReportProps();
            }
          );

          describe("and is NOT resumable (NotFoundFetch)", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              currentLastFMHookState.reportProperties.error = "NotFoundFetch";

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithCacheRetrieval();
            checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });

          describe("when the data is ABOUT to be complete", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              mockQuery.getReportData(
                currentLastFMHookState.reportProperties
              ).status.complete = true;
              currentLastFMHookState.reportProperties.ready = false;
              currentLastFMHookState.reportProperties.error = null;

              arrange();
            });

            checkEffectHookDataFetchingWithCacheRetrieval();
            checkEffectHookNodeSelection({ analyticsCallCount: 2 });
            checkEffectHookReportReadyWithNoCacheWriting({
              analyticsCallCount: 2,
            });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });
        });
      });
    });

    describe("when report cache writing is NOT bypassed", () => {
      beforeEach(() => {
        mockSunburstCacheControllerHook.write.mockResolvedValue({
          bypassed: false,
        });
      });

      describe("when the data state is ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.inProgress = false;
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = true;
            currentLastFMHookState.reportProperties.error = null;

            arrange();
          });

          checkInstantiateHooks();
          checkEffectHookDataFetchingWithCacheRetrieval();
          checkEffectHookNodeSelection({ analyticsCallCount: 1 });
          checkEffectHookReportReadyWithCacheWriting({ analyticsCallCount: 1 });
          checkErrorDisplayContainerProps();
          checkBillBoardProgressBarProps();
          checkSunBurstReportProps();
        });
      });

      describe("when the data state is NOT ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = false;
          });

          describe.each(resumableReportErrors)(
            "and is resumable (%s)",
            (resumableCondition) => {
              beforeEach(() => {
                currentLastFMHookState.reportProperties.inProgress = false;
                currentLastFMHookState.reportProperties.error =
                  resumableCondition;

                arrange();
              });

              checkInstantiateHooks();
              checkEffectHookDataFetchingWithResume();
              checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
              checkErrorDisplayContainerProps();
              checkBillBoardProgressBarProps();
              checkSunBurstReportProps();
            }
          );

          describe("and is NOT resumable (NotFoundFetch)", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              currentLastFMHookState.reportProperties.error = "NotFoundFetch";

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithCacheRetrieval();
            checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });

          describe("when the data is ABOUT to be complete", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              mockQuery.getReportData(
                currentLastFMHookState.reportProperties
              ).status.complete = true;
              currentLastFMHookState.reportProperties.ready = false;
              currentLastFMHookState.reportProperties.error = null;

              arrange();
            });

            checkEffectHookDataFetchingWithCacheRetrieval();
            checkEffectHookNodeSelection({ analyticsCallCount: 1 });
            checkEffectHookReportReadyWithCacheWriting({
              analyticsCallCount: 1,
            });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });
        });
      });
    });
  });

  describe("when report cache retrieval is NOT bypassed", () => {
    beforeEach(() => {
      mockSunburstCacheControllerHook.read.mockResolvedValue({
        bypassed: false,
      });
    });

    describe("when report cache writing is bypassed", () => {
      beforeEach(() => {
        mockSunburstCacheControllerHook.write.mockResolvedValue({
          bypassed: true,
        });
      });

      describe("when the data state is ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.inProgress = false;
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = true;
            currentLastFMHookState.reportProperties.error = null;

            arrange();
          });

          checkInstantiateHooks();
          checkEffectHookDataFetchingWithNoCacheRetrieval();
          checkEffectHookNodeSelection({ analyticsCallCount: 2 });
          checkEffectHookReportReadyWithNoCacheWriting({
            analyticsCallCount: 2,
          });
          checkErrorDisplayContainerProps();
          checkBillBoardProgressBarProps();
          checkSunBurstReportProps();
        });
      });

      describe("when the data state is NOT ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = false;
          });

          describe.each(resumableReportErrors)(
            "and is resumable (%s)",
            (resumableCondition) => {
              beforeEach(() => {
                currentLastFMHookState.reportProperties.inProgress = false;
                currentLastFMHookState.reportProperties.error =
                  resumableCondition;

                arrange();
              });

              checkInstantiateHooks();
              checkEffectHookDataFetchingWithNoCacheRetrieval();
              checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
              checkErrorDisplayContainerProps();
              checkBillBoardProgressBarProps();
              checkSunBurstReportProps();
            }
          );

          describe("and is NOT resumable (NotFoundFetch)", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              currentLastFMHookState.reportProperties.error = "NotFoundFetch";

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithNoCacheRetrieval();
            checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });

          describe("when the data is ABOUT to be complete", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              mockQuery.getReportData(
                currentLastFMHookState.reportProperties
              ).status.complete = true;
              currentLastFMHookState.reportProperties.ready = false;
              currentLastFMHookState.reportProperties.error = null;

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithNoCacheRetrieval();
            checkEffectHookNodeSelection({ analyticsCallCount: 2 });
            checkEffectHookReportReadyWithNoCacheWriting({
              analyticsCallCount: 2,
            });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });
        });
      });
    });

    describe("when report cache writing is NOT bypassed", () => {
      beforeEach(() => {
        mockSunburstCacheControllerHook.write.mockResolvedValue({
          bypassed: false,
        });
      });

      describe("when the data state is ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            currentLastFMHookState.reportProperties.inProgress = false;
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = true;
            currentLastFMHookState.reportProperties.error = null;

            arrange();
          });

          checkInstantiateHooks();
          checkEffectHookDataFetchingWithNoCacheRetrieval();
          checkEffectHookNodeSelection({ analyticsCallCount: 1 });
          checkEffectHookReportReadyWithCacheWriting({ analyticsCallCount: 1 });
          checkErrorDisplayContainerProps();
          checkBillBoardProgressBarProps();
          checkSunBurstReportProps();
        });
      });

      describe("when the data state is NOT ready", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.ready = false;
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockQuery.getReportData(
              currentLastFMHookState.reportProperties
            ).status.complete = false;
          });

          describe.each(resumableReportErrors)(
            "and is resumable (%s)",
            (resumableCondition) => {
              beforeEach(() => {
                currentLastFMHookState.reportProperties.inProgress = false;
                currentLastFMHookState.reportProperties.error =
                  resumableCondition;

                arrange();
              });

              checkInstantiateHooks();
              checkEffectHookDataFetchingWithNoCacheRetrieval();
              checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
              checkErrorDisplayContainerProps();
              checkBillBoardProgressBarProps();
              checkSunBurstReportProps();
            }
          );

          describe("and is NOT resumable (NotFoundFetch)", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              currentLastFMHookState.reportProperties.error = "NotFoundFetch";

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithNoCacheRetrieval();
            checkEffectHookNodeSelectionNoUpdate({ analyticsCallCount: 0 });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });

          describe("when the data is ABOUT to be complete", () => {
            beforeEach(() => {
              currentLastFMHookState.reportProperties.inProgress = false;
              mockQuery.getReportData(
                currentLastFMHookState.reportProperties
              ).status.complete = true;
              currentLastFMHookState.reportProperties.ready = false;
              currentLastFMHookState.reportProperties.error = null;

              arrange();
            });

            checkInstantiateHooks();
            checkEffectHookDataFetchingWithNoCacheRetrieval();
            checkEffectHookNodeSelection({ analyticsCallCount: 1 });
            checkEffectHookReportReadyWithCacheWriting({
              analyticsCallCount: 1,
            });
            checkErrorDisplayContainerProps();
            checkBillBoardProgressBarProps();
            checkSunBurstReportProps();
          });
        });
      });
    });
  });
});
