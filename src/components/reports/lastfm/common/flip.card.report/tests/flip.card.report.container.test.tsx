import { cleanup, render, act } from "@testing-library/react";
import {
  MockReportClass,
  MockUserStateEncapsulation,
} from "./mock.last.fm.report.class";
import FlipCardBaseReport from "../flip.card.report.base.class";
import FlipCardReport from "../flip.card.report.component";
import FlipCardReportContainer from "../flip.card.report.container";
import lastfm from "@locales/lastfm.json";
import Authentication from "@src/components/authentication/authentication.container";
import BillBoardSpinner from "@src/components/billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "@src/components/errors/display/error.display.component";
import Events from "@src/events/events";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import mockLastFMHook from "@src/hooks/tests/lastfm.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import mockMetricsHook from "@src/hooks/tests/metrics.mock.hook";
import UserInterfaceImageProvider from "@src/providers/ui/ui.images/ui.images.provider";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockRouter from "@src/tests/fixtures/mock.router";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("@src/hooks/metrics", () => () => mockMetricsHook);

jest.mock("@src/components/authentication/authentication.container", () =>
  jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

jest.mock(
  "@src/components/billboard/billboard.spinner/billboard.spinner.component",
  () => createMockedComponent("BillBoardSpinner")
);

jest.mock("@src/components/errors/display/error.display.component", () =>
  createMockedComponent("ErrorDisplay")
);

jest.mock("../flip.card.report.component", () =>
  createMockedComponent("FlipCardReport")
);

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("FlipCardReportContainer", () => {
  const testUsername = "niall-byrne";
  let mockHookState: userHookAsLastFMTop20AlbumReport;
  const report = new MockReportClass();
  const mockReportData = {
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

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookState();
  });

  const getImageLoader = () => {
    return (FlipCardReport as jest.Mock).mock.calls[0][0].imageIsLoaded;
  };

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

  const checkErrorDisplay = (errorKey: string) => {
    it("should render the ErrorDisplay as expected", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
      expect(call.errorKey).toBe(errorKey);
      expect(typeof call.resetError).toBe("function");
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const checkFlipCardReportProps = (visible: boolean) => {
    const call = (FlipCardReport as jest.Mock).mock.calls[0][0];
    expect(call.userState).toBeInstanceOf(MockUserStateEncapsulation);
    expect(call.userState.userProperties).toBe(mockHookState.userProperties);
    expect(call.report).toBeInstanceOf(FlipCardBaseReport);
    expect(call.visible).toBe(visible);
    expect(typeof call.imageIsLoaded).toBe("function");
    expect(typeof call.t).toBe("function");
    expect(Object.keys(call).length).toBe(5);
  };

  const resetHookState = () => {
    mockHookState = {
      ...(mockLastFMHook as userHookAsLastFMTop20AlbumReport),
      userProperties: {
        ...(mockLastFMHook as userHookAsLastFMTop20AlbumReport).userProperties,
        data: {
          ...(mockLastFMHook as userHookAsLastFMTop20AlbumReport).userProperties
            .data,
          report: {
            ...(mockLastFMHook as userHookAsLastFMTop20AlbumReport)
              .userProperties.data.report,
          },
        },
      },
    };
  };

  const arrange = () => {
    render(
      <UserInterfaceImageProvider>
        <FlipCardReportContainer
          userName={testUsername}
          user={mockHookState}
          reportClass={MockReportClass}
        />
      </UserInterfaceImageProvider>
    );
  };

  describe("when there has been an error", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockHookState.userProperties.ready = false;
    });

    describe("when the request has failed", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "FailureFetch";
        arrange();
      });

      checkDataFetching();
      checkErrorDisplay("lastfmCommunications");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      it("should NOT call the FlipCardReport component", () => {
        expect(FlipCardReport).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(report.retryRoute);
        });
      });
    });

    describe("when the request has timed out", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "TimeoutFetch";
        arrange();
      });

      it("should NOT clear the state", () => {
        expect(mockHookState.clear).toBeCalledTimes(1);
        expect(mockHookState.clear).toBeCalledWith();
      });

      it("should request new data", () => {
        expect(mockHookState[report.hookMethod]).toBeCalledTimes(2);
        expect(mockHookState[report.hookMethod]).toHaveBeenNthCalledWith(
          1,
          testUsername
        );
        expect(mockHookState[report.hookMethod]).toHaveBeenNthCalledWith(
          2,
          testUsername
        );
      });

      it("should clear the state during cleanup", () => {
        cleanup();
        expect(mockHookState.clear).toBeCalledTimes(2);
      });

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(1);
      });

      it("should call the FlipCardReport component", () => {
        checkFlipCardReportProps(false);
      });

      describe("when the images are all loaded", () => {
        beforeEach(() => {
          const imageLoader = getImageLoader();
          act(() => imageLoader());
          act(() => imageLoader());
        });

        it("should NOT set the images to the 'ready' state", () => {
          expect(mockHookState.ready).toBeCalledTimes(0);
        });

        it("should NOT increment any metrics", () => {
          expect(mockMetricsHook.increment).toBeCalledTimes(0);
        });

        it("should NOT generate an analytics event", () => {
          expect(mockAnalyticsHook.event).toBeCalledTimes(0);
        });
      });
    });

    describe("when the request is unauthorized", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "UnauthorizedFetch";
        arrange();
      });

      checkDataFetching();

      it("should call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(1);
        checkMockCall(Authentication, {});
      });

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      it("should NOT call the FlipCardReport component", () => {
        expect(FlipCardReport).toBeCalledTimes(0);
      });
    });

    describe("when the request has been ratelimited", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "RatelimitedFetch";
        arrange();
      });

      checkDataFetching();

      checkErrorDisplay("lastfmRatelimited");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      it("should NOT call the FlipCardReport component", () => {
        expect(FlipCardReport).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should reload the page", () => {
          expect(mockRouter.reload).toBeCalledTimes(1);
        });
      });
    });

    describe("when NO valid user has been found", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "NotFoundFetch";
        arrange();
      });

      checkDataFetching();

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      it("should NOT call the FlipCardReport component", () => {
        expect(FlipCardReport).toBeCalledTimes(0);
      });

      checkErrorDisplay("userNotFound");

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(report.retryRoute);
        });
      });
    });
  });

  describe("when there has NOT been an error", () => {
    describe("when the data is NOT in ready state", () => {
      beforeEach(() => {
        mockHookState.userProperties.ready = false;
      });

      describe("when data loading is in progress", () => {
        beforeEach(() => {
          mockHookState.userProperties.inProgress = true;
          mockHookState.userProperties.userName = testUsername;
          arrange();
        });

        checkDataFetching();

        it("should NOT call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(0);
        });

        it("should call the BillBoardSpinner with 'true'", () => {
          expect(BillBoardSpinner).toBeCalledTimes(1);
          checkMockCall(BillBoardSpinner, {
            visible: true,
            title: _t(lastfm[report.translationKey].communication),
          });
        });

        it("should call the FlipCardReport component", () => {
          checkFlipCardReportProps(false);
        });

        describe("when the images are all loaded", () => {
          beforeEach(() => {
            const imageLoader = getImageLoader();
            act(() => imageLoader());
            act(() => imageLoader());
          });

          it("should NOT call to set the data to the 'ready' state", () => {
            expect(mockHookState.ready).toBeCalledTimes(0);
          });

          it("should NOT increment any metrics", () => {
            expect(mockMetricsHook.increment).toBeCalledTimes(0);
          });

          it("should NOT generate an analytics event", () => {
            expect(mockAnalyticsHook.event).toBeCalledTimes(0);
          });
        });
      });

      describe("when data loading is complete", () => {
        beforeEach(() => {
          mockHookState.userProperties.inProgress = false;
          mockHookState.userProperties.userName = testUsername;
          mockHookState.userProperties.data.report = mockReportData;
          arrange();
        });

        checkDataFetching();

        it("should NOT call the Authentication component", () => {
          expect(Authentication).toBeCalledTimes(0);
        });

        it("should call the BillBoardSpinner with 'true'", () => {
          expect(BillBoardSpinner).toBeCalledTimes(1);
          checkMockCall(BillBoardSpinner, {
            visible: true,
            title: _t(lastfm[report.translationKey].communication),
          });
        });

        it("should call the FlipCardReport component", () => {
          checkFlipCardReportProps(false);
        });

        describe("when the images are all loaded", () => {
          beforeEach(() => {
            const imageLoader = getImageLoader();
            act(() => imageLoader());
            act(() => imageLoader());
          });

          it("should call set the images to the 'ready' state", () => {
            expect(mockHookState.ready).toBeCalledTimes(1);
          });

          it("should increment any the SearchMetric count", () => {
            expect(mockMetricsHook.increment).toBeCalledTimes(1);
            expect(mockMetricsHook.increment).toBeCalledWith("SearchMetric");
          });

          it("should generate an analytics event indicating the report was viewed", () => {
            expect(mockAnalyticsHook.event).toBeCalledTimes(1);
            expect(mockAnalyticsHook.event).toBeCalledWith(
              Events.LastFM.ReportPresented("TOP20 ALBUMS")
            );
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

        describe("when the user has NO listens", () => {
          beforeEach(() => {
            arrange();
          });

          checkDataFetching();

          it("should NOT call the Authentication component", () => {
            expect(Authentication).toBeCalledTimes(0);
          });

          it("should NOT call the BillBoardSpinner", () => {
            expect(BillBoardSpinner).toBeCalledTimes(0);
          });

          it("should NOT call the FlipCardReport component", () => {
            expect(FlipCardReport).toBeCalledTimes(0);
          });

          checkErrorDisplay("userWithNoListens");

          describe("when resetError is called on ErrorDisplay", () => {
            beforeEach(() => {
              const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
              call.resetError();
            });

            it("should change urls to the search route", () => {
              expect(mockRouter.push).toBeCalledTimes(1);
              expect(mockRouter.push).toBeCalledWith(report.retryRoute);
            });
          });
        });

        describe("when the user has listens", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report = mockReportData;
            arrange();
          });

          checkDataFetching();

          it("should NOT call the Authentication component", () => {
            expect(Authentication).toBeCalledTimes(0);
          });

          it("should toggle the BillBoardSpinner off", () => {
            expect(BillBoardSpinner).toBeCalledTimes(1);
            checkMockCall(
              BillBoardSpinner,
              {
                visible: false,
                title: _t(lastfm[report.translationKey].communication),
              },
              0
            );
          });

          it("should toggle the FlipCardReport on", () => {
            checkFlipCardReportProps(true);
          });
        });
      });
    });
  });
});
