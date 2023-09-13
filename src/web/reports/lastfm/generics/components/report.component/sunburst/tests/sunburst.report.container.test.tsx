import { cleanup, render } from "@testing-library/react";
import mockSunBurstLayoutControllerHook from "../controllers/__mocks__/sunburst.report.layout.controller.hook.mock";
import SunBurstReport from "../sunburst.report.component";
import SunBurstReportContainer from "../sunburst.report.container";
import lastfm from "@locales/lastfm.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import mockSunBurstControllerHook from "@src/web/reports/generics/state/controllers/sunburst/__mocks__/sunburst.controller.hook.mock";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import mockLastFMHook from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import { MockQueryClass } from "@src/web/reports/lastfm/generics/state/queries/tests/implementations/concrete.sunburst.query.class";
import BillBoardProgressBar from "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { reportHookAsLastFMPlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook", () =>
  jest.fn()
);

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock(
  "@src/web/reports/generics/state/controllers/sunburst/sunburst.controller.hook"
);

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
  const mockUsername = "mockUsername";
  const mockLastFmT = new MockUseTranslation("lastfm").t;
  const mockSunBurstT = new MockUseTranslation("sunburst").t;

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookStates();
  });

  const arrange = () => {
    render(
      <SunBurstReportContainer
        userName={mockUsername}
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
  };

  const checkEffectHookDataFetching = () => {
    describe("useEffect (data fetching)", () => {
      it("should clear the state and start a fetch on component mount", () => {
        expect(currentLastFMHookState.clear).toBeCalledTimes(1);
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledTimes(1);
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledWith(
          mockUsername
        );
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
          mockUsername
        );
      });

      it("should resume the building the report", () => {
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledTimes(2);
        expect(currentLastFMHookState[mockQuery.hookMethod]).toBeCalledWith(
          mockUsername
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
            .getEncapsulatedNode(mockSunBurstControllerHook.node.selected)
            .getDrawerEvent()
        );
      });

      it("should trigger a layout update", () => {
        expect(mockSunBurstLayoutControllerHook.update).toBeCalledTimes(1);
        expect(mockSunBurstLayoutControllerHook.update).toBeCalledWith();
      });
    });
  };

  const checkEffectHookReportReady = ({
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
          sunBurstController: mockSunBurstControllerHook,
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

      checkEffectHookDataFetching();
      checkEffectHookNodeSelection({ analyticsCallCount: 2 });
      checkEffectHookReportReady({ analyticsCallCount: 2 });
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

      describe("and is resumable", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.inProgress = false;
          currentLastFMHookState.reportProperties.error = "TimeoutFetch";

          arrange();
        });

        checkEffectHookDataFetchingWithResume();
        checkErrorDisplayContainerProps();
        checkBillBoardProgressBarProps();
        checkSunBurstReportProps();
      });

      describe("and is NOT resumable", () => {
        beforeEach(() => {
          currentLastFMHookState.reportProperties.inProgress = false;
          currentLastFMHookState.reportProperties.error = "NotFoundFetch";

          arrange();
        });

        checkEffectHookDataFetching();
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

        checkEffectHookDataFetching();
        checkEffectHookNodeSelection({ analyticsCallCount: 2 });
        checkEffectHookReportReady({ analyticsCallCount: 2 });
        checkErrorDisplayContainerProps();
        checkBillBoardProgressBarProps();
        checkSunBurstReportProps();
      });
    });
  });
});
