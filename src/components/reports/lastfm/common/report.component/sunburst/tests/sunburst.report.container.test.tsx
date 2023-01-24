import { cleanup, render } from "@testing-library/react";
import mockSunBurstLayoutControllerHook from "../controllers/__mocks__/sunburst.report.layout.controller.hook.mock";
import SunBurstReport from "../sunburst.report.component";
import SunBurstReportContainer from "../sunburst.report.container";
import lastfm from "@locales/lastfm.json";
import BillBoardProgressBar from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import LastFMErrorDisplayContainer from "@src/components/reports/lastfm/common/error.display/error.display.container";
import { MockReportClass } from "@src/components/reports/lastfm/common/report.class/tests/implementations/concrete.sunburst.report.class";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockLastFMHook from "@src/hooks/__mocks__/lastfm.hook.mock";
import mockSunBurstControllerHook from "@src/hooks/controllers/__mocks__/sunburst.controller.hook.mock";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import mockMetricsHook from "@src/web/metrics/collection/state/hooks/__mocks__/metrics.hook.mock";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook", () =>
  jest.fn()
);

jest.mock("@src/web/metrics/collection/state/hooks/metrics.hook");

jest.mock("@src/hooks/controllers/sunburst.controller.hook");

jest.mock("../controllers/sunburst.report.layout.controller.hook");

jest.mock(
  "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component",
  () =>
    require("@fixtures/react/parent").createComponent("BillBoardProgressBar")
);

jest.mock(
  "@src/components/reports/lastfm/common/error.display/error.display.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "LastFMErrorDisplayContainer"
    )
);

jest.mock("../sunburst.report.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstReport")
);

describe("SunBurstReportContainer", () => {
  let currentLastFMHookState: userHookAsLastFMPlayCountByArtistReport;

  const mockReport = new MockReportClass();
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
        reportClass={MockReportClass}
      />
    );
  };

  const resetHookStates = () => {
    currentLastFMHookState =
      mockLastFMHook as userHookAsLastFMPlayCountByArtistReport;

    currentLastFMHookState.userProperties = JSON.parse(
      JSON.stringify(mockLastFMHook.userProperties)
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
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledTimes(
          1
        );
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledWith(
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
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledWith(
          mockUsername
        );
      });

      it("should resume the building the report", () => {
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledTimes(
          2
        );
        expect(currentLastFMHookState[mockReport.hookMethod]).toBeCalledWith(
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
          mockReport
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
        Events.LastFM.ReportPresented(mockReport.analyticsReportType)
      );
    });
  };

  const checkErrorDisplayContainerProps = () => {
    it("should call the LastFMErrorDisplayContainer with the expected props", () => {
      expect(LastFMErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(LastFMErrorDisplayContainer, {
        report: mockReport,
        userProperties: currentLastFMHookState.userProperties,
      });
    });
  };

  const checkBillBoardProgressBarProps = () => {
    it("should call the BillBoardProgressBar with the expected props", () => {
      expect(BillBoardProgressBar).toBeCalledTimes(1);
      checkMockCall(BillBoardProgressBar, {
        details: mockReport.getProgressDetails(
          currentLastFMHookState.userProperties,
          mockSunBurstT
        ),
        titleText: _t(lastfm[mockReport.translationKey].communication),
        value: mockReport.getProgressPercentage(
          currentLastFMHookState.userProperties
        ),
        visible: !currentLastFMHookState.userProperties.ready,
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
          encapsulatedReportState: mockReport.getEncapsulatedReportState(
            currentLastFMHookState.userProperties
          ),
          lastFMt: mockLastFmT,
          report: mockReport,
          sunBurstT: mockSunBurstT,
          sunBurstController: mockSunBurstControllerHook,
          sunBurstLayoutController: mockSunBurstLayoutControllerHook,
          visible: currentLastFMHookState.userProperties.ready,
        },
        0,
        ["update"],
        false,
        [
          {
            name: "encapsulatedReportState",
            class: mockReport.encapsulationClass,
          },
        ]
      );
    });
  };

  describe("when the data state is ready", () => {
    beforeEach(() => {
      currentLastFMHookState.userProperties.ready = false;
    });

    describe("when the report is complete", () => {
      beforeEach(() => {
        currentLastFMHookState.userProperties.inProgress = false;
        mockReport.getReportData(
          currentLastFMHookState.userProperties
        ).status.complete = true;
        currentLastFMHookState.userProperties.error = null;

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
      currentLastFMHookState.userProperties.ready = false;
    });

    describe("when the report is NOT complete", () => {
      beforeEach(() => {
        mockReport.getReportData(
          currentLastFMHookState.userProperties
        ).status.complete = false;
      });

      describe("and is resumable", () => {
        beforeEach(() => {
          currentLastFMHookState.userProperties.inProgress = false;
          currentLastFMHookState.userProperties.error = "TimeoutFetch";

          arrange();
        });

        checkEffectHookDataFetchingWithResume();
        checkErrorDisplayContainerProps();
        checkBillBoardProgressBarProps();
        checkSunBurstReportProps();
      });

      describe("and is NOT resumable", () => {
        beforeEach(() => {
          currentLastFMHookState.userProperties.inProgress = false;
          currentLastFMHookState.userProperties.error = "NotFoundFetch";

          arrange();
        });

        checkEffectHookDataFetching();
        checkErrorDisplayContainerProps();
        checkBillBoardProgressBarProps();
        checkSunBurstReportProps();
      });

      describe("when the data is ABOUT to be complete", () => {
        beforeEach(() => {
          currentLastFMHookState.userProperties.inProgress = false;
          mockReport.getReportData(
            currentLastFMHookState.userProperties
          ).status.complete = true;
          currentLastFMHookState.userProperties.ready = false;
          currentLastFMHookState.userProperties.error = null;

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
