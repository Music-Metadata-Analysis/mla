import { cleanup, render, act } from "@testing-library/react";
import lastfm from "../../../../../../public/locales/en/lastfm.json";
import routes from "../../../../../config/routes";
import Events from "../../../../../events/events";
import mockAnalyticsHook from "../../../../../hooks/tests/analytics.mock";
import mockLastFMHook from "../../../../../hooks/tests/lastfm.mock";
import UserInterfaceImageProvider from "../../../../../providers/ui/ui.images/ui.images.provider";
import UserAlbumDataState from "../../../../../providers/user/encapsulations/lastfm/user.state.album.class";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../../tests/fixtures/mock.router";
import BillBoardSpinner from "../../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../../errors/display/error.display.component";
import FlipCardReport from "../../common/flip.card.report/flip.card.report.component";
import Top20AlbumsContainer from "../top20.albums.container";
import Top20AlbumsReport from "../top20.albums.report.class";
import type { userHookAsLastFMTop20AlbumReport } from "../../../../../types/user/hook.types";

jest.mock("../../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

jest.mock(
  "../../../../billboard/billboard.spinner/billboard.spinner.component",
  () => createMockedComponent("BillBoardSpinner")
);

jest.mock("../../../../errors/display/error.display.component", () =>
  createMockedComponent("ErrorDisplay")
);

jest.mock("../../common/flip.card.report/flip.card.report.component", () =>
  createMockedComponent("FlipCardReport")
);

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
}));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockTypedLastFMHook = mockLastFMHook as userHookAsLastFMTop20AlbumReport;

describe("Top20ReportContainer", () => {
  const testUsername = "niall-byrne";
  let mockHookState: userHookAsLastFMTop20AlbumReport;
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetHookState();
  });

  const checkDataFetching = () => {
    it("should clear the state and request new data", () => {
      expect(mockHookState.clear).toBeCalledTimes(1);
      expect(mockHookState.top20albums).toBeCalledTimes(1);
      expect(mockHookState.top20albums).toBeCalledWith(testUsername);
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
    expect(call.userState).toBeInstanceOf(UserAlbumDataState);
    expect(call.userState.userProperties).toBe(mockHookState.userProperties);
    expect(call.visible).toBe(visible);
    expect(typeof call.imageIsLoaded).toBe("function");
    expect(typeof call.t).toBe("function");
    expect(call.report).toBeInstanceOf(Top20AlbumsReport);
    expect(Object.keys(call).length).toBe(5);
  };

  const resetHookState = () => {
    mockHookState = {
      ...mockTypedLastFMHook,
      userProperties: {
        ...mockTypedLastFMHook.userProperties,
        data: {
          ...mockTypedLastFMHook.userProperties.data,
          report: {
            ...mockTypedLastFMHook.userProperties.data.report,
          },
        },
      },
    };
  };

  const arrange = () => {
    render(
      <UserInterfaceImageProvider>
        <Top20AlbumsContainer userName={testUsername} user={mockHookState} />
      </UserInterfaceImageProvider>
    );
  };

  describe("when there has been an error", () => {
    describe("when the request has failed", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "FailureFetchUser";
        arrange();
      });

      checkDataFetching();
      checkErrorDisplay("lastfm_communications");

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
          expect(mockRouter.push).toBeCalledWith(
            routes.search.lastfm.top20albums
          );
        });
      });
    });

    describe("when the request has been ratelimited", () => {
      beforeEach(() => {
        mockHookState.userProperties.error = "RatelimitedFetchUser";
        arrange();
      });

      checkDataFetching();
      checkErrorDisplay("lastfm_ratelimited");

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
        mockHookState.userProperties.error = "NotFoundFetchUser";
        arrange();
      });

      checkDataFetching();

      it("should NOT call the BillBoardSpinner", () => {
        expect(BillBoardSpinner).toBeCalledTimes(0);
      });

      it("should NOT call the FlipCardReport component", () => {
        expect(FlipCardReport).toBeCalledTimes(0);
      });

      checkErrorDisplay("user_not_found");

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(
            routes.search.lastfm.top20albums
          );
        });
      });
    });
  });

  describe("when there has NOT been an error", () => {
    describe("when the data is NOT in ready state", () => {
      beforeEach(() => {
        mockHookState.userProperties.ready = false;
      });

      const getImageLoader = () => {
        return (FlipCardReport as jest.Mock).mock.calls[0][0].imageIsLoaded;
      };

      describe("when data loading is in progress", () => {
        beforeEach(() => {
          mockHookState.userProperties.inProgress = true;
          mockHookState.userProperties.userName = testUsername;
          arrange();
        });

        checkDataFetching();

        it("should call the BillBoardSpinner with 'true'", () => {
          expect(BillBoardSpinner).toBeCalledTimes(1);
          checkMockCall(BillBoardSpinner, {
            visible: true,
            title: lastfm.top20Albums.communication,
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

        it("should call the BillBoardSpinner with 'true'", () => {
          expect(BillBoardSpinner).toBeCalledTimes(1);
          checkMockCall(BillBoardSpinner, {
            visible: true,
            title: lastfm.top20Albums.communication,
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
          mockHookState.userProperties.userName = "User";
          mockHookState.userProperties.profileUrl = "http://myprofile.com";
        });

        describe("when the user has NO listens", () => {
          beforeEach(() => {
            arrange();
          });

          checkDataFetching();

          it("should NOT call the BillBoardSpinner", () => {
            expect(BillBoardSpinner).toBeCalledTimes(0);
          });

          it("should NOT call the FlipCardReport component", () => {
            expect(FlipCardReport).toBeCalledTimes(0);
          });

          checkErrorDisplay("user_with_no_listens");

          describe("when resetError is called on ErrorDisplay", () => {
            beforeEach(() => {
              const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
              call.resetError();
            });

            it("should change urls to the search route", () => {
              expect(mockRouter.push).toBeCalledTimes(1);
              expect(mockRouter.push).toBeCalledWith(
                routes.search.lastfm.top20albums
              );
            });
          });
        });

        describe("when the user has listens", () => {
          beforeEach(() => {
            mockHookState.userProperties.data.report = mockReportData;
            arrange();
          });

          checkDataFetching();

          it("should toggle the BillBoardSpinner off", () => {
            expect(BillBoardSpinner).toBeCalledTimes(1);
            checkMockCall(
              BillBoardSpinner,
              {
                visible: false,
                title: lastfm.top20Albums.communication,
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
