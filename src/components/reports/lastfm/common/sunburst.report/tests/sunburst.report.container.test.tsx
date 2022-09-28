import { cleanup, render, screen } from "@testing-library/react";
import {
  MockReportClass,
  MockUserStateEncapsulation,
} from "./fixtures/mock.sunburst.report.class";
import AggregateErrorDisplayComponent from "../../error.displays/aggregate.error.display.component";
import SunBurstBaseReport from "../sunburst.report.base.class";
import SunBurstReport from "../sunburst.report.component";
import SunBurstReportContainer from "../sunburst.report.container";
import lastfm from "@locales/lastfm.json";
import sunburst from "@locales/sunburst.json";
import BillBoardProgressBar from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import apiRoutes from "@src/config/apiRoutes";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import mockLastFMHook from "@src/hooks/tests/lastfm.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import mockMetricsHook from "@src/hooks/tests/metrics.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("@src/hooks/metrics", () => () => mockMetricsHook);

jest.mock("../../error.displays/aggregate.error.display.component");

jest.mock(
  "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component",
  () => {
    const { createComponent } = require("@fixtures/react");
    return createComponent("BillBoardProgressBar");
  }
);

jest.mock("../sunburst.report.component", () =>
  require("@fixtures/react").createComponent("SunBurstReport")
);

describe("SunBurstReportContainer", () => {
  const testUsername = "niall-byrne";
  let mockHookState: userHookAsLastFMPlayCountByArtistReport;
  const report = new MockReportClass();
  const mockReportData = {
    albums: [],
    artists: [],
    tracks: [],
    playCountByArtist: {
      created: "",
      content: [
        {
          name: "The Cure",
          playcount: 100,
          fetched: true,
          albums: [],
        },
      ],
      status: {
        complete: false,
        steps_total: 0,
        steps_complete: 0,
      },
    },
    image: [
      {
        size: "large" as const,
        "#text": "http://someurl.com",
      },
    ],
    playcount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookState();
  });

  const checkDataFetching = () => {
    it("should clear the state and request new data", () => {
      expect(mockHookState.clear).toBeCalledTimes(1);
      expect(mockHookState[report.hookMethod]).toBeCalledTimes(1);
      expect(mockHookState[report.hookMethod]).toBeCalledWith(testUsername);
    });

    it("should clear the state during cleanup", () => {
      cleanup();
      expect(mockHookState.clear).toBeCalledTimes(2);
    });
  };

  const checkDataFetchingWithResume = () => {
    it("should clear the state and request new data, repeatedly", () => {
      expect(mockHookState.clear).toBeCalledTimes(1);
      expect(mockHookState[report.hookMethod]).toBeCalledTimes(2);
      expect(mockHookState[report.hookMethod]).toBeCalledWith(testUsername);
    });

    it("should clear the state during cleanup", () => {
      cleanup();
      expect(mockHookState.clear).toBeCalledTimes(2);
    });
  };

  const testTranslationFunctions = (call: {
    lastFMt: (value: string) => string;
    sunBurstT: (value: string) => string;
  }) => {
    expect(typeof call.lastFMt).toBe("function");
    expect(typeof call.sunBurstT).toBe("function");
    expect(call.lastFMt("playCountByArtist.title")).toBe(
      _t(lastfm.playCountByArtist.title)
    );
    expect(call.sunBurstT("info.interaction")).toBe(
      _t(sunburst.info.interaction)
    );
  };

  const checkSunBurstReportProps = (visible: boolean) => {
    const call = (SunBurstReport as jest.Mock).mock.calls[0][0];
    expect(call.userState).toBeInstanceOf(MockUserStateEncapsulation);
    expect(call.userState.userProperties).toStrictEqual(
      mockHookState.userProperties
    );
    expect(call.report).toBeInstanceOf(SunBurstBaseReport);
    expect(call.visible).toBe(visible);
    testTranslationFunctions(call);
    expect(Object.keys(call).length).toBe(5);
  };

  const expectedBillBoardTitle = () =>
    _t(lastfm[report.translationKey].communication);

  const resetHookState = () => {
    mockHookState = {
      ...(mockLastFMHook as userHookAsLastFMPlayCountByArtistReport),
      userProperties: {
        ...(mockLastFMHook as userHookAsLastFMPlayCountByArtistReport)
          .userProperties,
        data: {
          ...(mockLastFMHook as userHookAsLastFMPlayCountByArtistReport)
            .userProperties.data,
          report: {
            ...(mockLastFMHook as userHookAsLastFMPlayCountByArtistReport)
              .userProperties.data.report,
          },
        },
      },
    };
  };

  const arrange = () => {
    render(
      <SunBurstReportContainer
        userName={testUsername}
        user={mockHookState}
        reportClass={MockReportClass}
      />
    );
  };

  describe("when an error display has been triggered", () => {
    const mockErrorDisplayText = "MockErrorDisplay";

    beforeEach(() => {
      const mockErrorDisplay = jest.fn(() => <div>{mockErrorDisplayText}</div>);
      (AggregateErrorDisplayComponent as jest.Mock).mockImplementation(
        mockErrorDisplay
      );
      mockHookState.userProperties.ready = false;
      mockHookState.userProperties.error = "FailureFetch";
      arrange();
    });

    checkDataFetching();

    it("should render the AggregateErrorDisplayComponent as expected", () => {
      expect(AggregateErrorDisplayComponent).toBeCalledTimes(2);

      const checkCall = (index: number) => {
        const call = (AggregateErrorDisplayComponent as jest.Mock).mock.calls[
          index
        ][0];
        expect(call.report).toBeInstanceOf(MockReportClass);
        expect(call.userProperties).toStrictEqual(mockHookState.userProperties);
        expect(Object.keys(call).length).toBe(2);
      };

      checkCall(0);
      checkCall(1);
    });

    it("should render the mockErrorDisplay component", async () => {
      expect(await screen.findByText(mockErrorDisplayText)).toBeTruthy();
    });

    it("should NOT call the BillBoardProgressBar", () => {
      expect(BillBoardProgressBar).toBeCalledTimes(0);
    });

    it("should NOT call the SunBurstReport component", () => {
      expect(SunBurstReport).toBeCalledTimes(0);
    });
  });

  describe("when an error display has NOT been triggered", () => {
    beforeEach(() => {
      const mockErrorDisplay = jest.fn(() => null);
      (AggregateErrorDisplayComponent as jest.Mock).mockImplementation(
        mockErrorDisplay
      );
    });

    describe("when the data is NOT in ready state", () => {
      beforeEach(() => {
        mockHookState.userProperties.userName = testUsername;
        mockHookState.userProperties.data.report = mockReportData;
        mockHookState.userProperties.ready = false;
      });

      describe("when data loading is in progress", () => {
        beforeEach(() => {
          mockHookState.userProperties.inProgress = true;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report.playCountByArtist.status =
              {
                complete: true,
                steps_complete: 20,
                steps_total: 20,
              };
            arrange();
          });

          checkDataFetching();

          it("should call the BillBoardProgressBar twice, (0% and 100%)", () => {
            expect(BillBoardProgressBar).toBeCalledTimes(2);
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 0,
              },
              0
            );
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 100,
              },
              1
            );
          });

          it("should call the SunBurstReport component (NOT visible)", () => {
            checkSunBurstReportProps(false);
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report.playCountByArtist.status =
              {
                complete: false,
                steps_complete: 10,
                steps_total: 20,
                operation: {
                  type: "Album Details",
                  resource: "Disintegration",
                  url: apiRoutes.v2.data.artists.albumsGet,
                  params: {
                    userName: "niall-byrne",
                    artist: "The Cure",
                    album: "Disintegration",
                  },
                },
              };
            arrange();
          });

          checkDataFetching();

          it("should call the BillBoardProgressBar twice (0% and 50%)", () => {
            expect(BillBoardProgressBar).toBeCalledTimes(2);
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 0,
              },
              0
            );
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "Disintegration",
                  type: _t(sunburst.detailTypes["Album Details"]),
                },
                value: 50,
              },
              1
            );
          });

          it("should call the SunBurstReport component (NOT visible)", () => {
            checkSunBurstReportProps(false);
          });
        });
      });

      describe("when data loading is NOT in progress", () => {
        beforeEach(() => {
          mockHookState.userProperties.inProgress = false;
        });

        describe("when the report is complete", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report.playCountByArtist.status =
              {
                complete: true,
                steps_complete: 20,
                steps_total: 20,
              };
            arrange();
          });

          checkDataFetching();

          it("should call the BillBoardProgressBar twice, (0% and 100%)", () => {
            expect(BillBoardProgressBar).toBeCalledTimes(2);
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 0,
              },
              0
            );
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 100,
              },
              1
            );
          });

          it("should call the SunBurstReport component (NOT visible)", () => {
            checkSunBurstReportProps(false);
          });
        });

        describe("when the report is NOT complete", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report.playCountByArtist.status =
              {
                complete: false,
                steps_complete: 10,
                steps_total: 20,
                operation: {
                  type: "Album Details",
                  resource: "Disintegration",
                  url: apiRoutes.v2.data.artists.albumsGet,
                  params: {
                    userName: "niall-byrne",
                    artist: "The Cure",
                    album: "Disintegration",
                  },
                },
              };
            arrange();
          });

          checkDataFetchingWithResume();

          it("should call the BillBoardProgressBar twice (0% and 50%)", () => {
            expect(BillBoardProgressBar).toBeCalledTimes(2);
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 0,
              },
              0
            );
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: true,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "Disintegration",
                  type: _t(sunburst.detailTypes["Album Details"]),
                },
                value: 50,
              },
              1
            );
          });

          it("should call the SunBurstReport component (NOT visible)", () => {
            checkSunBurstReportProps(false);
          });
        });
      });
    });

    describe("when the data is in a ready state", () => {
      beforeEach(() => {
        mockHookState.userProperties.ready = true;
      });

      describe("when a valid user has been found", () => {
        beforeEach(() => {
          mockHookState.userProperties.userName = testUsername;
          mockHookState.userProperties.profileUrl = "http://myprofile.com";
        });

        describe("when the user has listens", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report = mockReportData;
            mockHookState.userProperties.data.report.playCountByArtist.status =
              {
                complete: true,
                steps_complete: 20,
                steps_total: 20,
              };
            arrange();
          });

          checkDataFetching();

          it("should call the BillBoardProgressBar twice (0% and 100%, toggling it off)", () => {
            expect(BillBoardProgressBar).toBeCalledTimes(2);
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: false,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 0,
              },
              0
            );
            checkMockCall(
              BillBoardProgressBar,
              {
                visible: false,
                title: expectedBillBoardTitle(),
                details: {
                  resource: "",
                  type: "",
                },
                value: 100,
              },
              1
            );
          });

          it("should call the SunBurstReport (visible)", () => {
            checkSunBurstReportProps(true);
          });
        });
      });
    });
  });
});
