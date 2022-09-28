import { render } from "@testing-library/react";
import AggregateErrorDisplayComponent from "../aggregate.error.display.component";
import Authentication from "@src/components/authentication/authentication.container";
import ErrorDisplay from "@src/components/errors/display/error.display.component";
import { MockReportClass } from "@src/components/reports/lastfm/common/sunburst.report/tests/fixtures/mock.sunburst.report.class";
import MockStage2Report from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/tests/fixtures/user.state.playcount.by.artist.sunburst.stage.2.json";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockRouter from "@src/tests/fixtures/mock.router";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

jest.mock("@src/components/authentication/authentication.container", () =>
  jest.fn(() => <div>MockedAuthenticationComponent</div>)
);

jest.mock("@src/components/errors/display/error.display.component", () =>
  require("@fixtures/react").createComponent("ErrorDisplay")
);

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("AggregateErrorDisplayComponent", () => {
  let mockUserProperties: LastFMUserStateBase;
  const mockReport = new MockReportClass();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserProperties = JSON.parse(JSON.stringify(MockStage2Report));
  });

  const checkErrorDisplay = (errorKey: string) => {
    it("should render the ErrorDisplay as expected", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
      expect(call.errorKey).toBe(errorKey);
      expect(typeof call.resetError).toBe("function");
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const arrange = () => {
    render(
      <AggregateErrorDisplayComponent
        userProperties={mockUserProperties}
        report={mockReport}
      />
    );
  };

  describe("when there has been an error", () => {
    describe("when the request has failed", () => {
      beforeEach(() => {
        mockUserProperties.error = "FailureFetch";
        arrange();
      });

      checkErrorDisplay("lastfmCommunications");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(mockReport.retryRoute);
        });
      });
    });

    describe("when the request is unauthorized", () => {
      beforeEach(() => {
        mockUserProperties.error = "UnauthorizedFetch";
        arrange();
      });

      it("should call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(1);
        checkMockCall(Authentication, {});
      });
    });

    describe("when the request has been ratelimited", () => {
      beforeEach(() => {
        mockUserProperties.error = "RatelimitedFetch";
        arrange();
      });

      checkErrorDisplay("lastfmRatelimited");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
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
        mockUserProperties.error = "NotFoundFetch";
        arrange();
      });

      checkErrorDisplay("userNotFound");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(mockReport.retryRoute);
        });
      });
    });
  });

  describe("when there has NOT been an error", () => {
    beforeEach(() => {
      mockUserProperties.error = null;
    });

    describe("when the user has no valid listens", () => {
      beforeEach(() => {
        mockUserProperties.userName = "niall-byrne";
        mockUserProperties.data.report = {
          image: [],
          playcount: 0,
          playCountByArtist: {
            content: [],
            created: "",
            status: { complete: true, steps_complete: 1, steps_total: 1 },
          },
        };
        arrange();
      });

      checkErrorDisplay("userWithNoListens");

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });

      describe("when resetError is called on ErrorDisplay", () => {
        beforeEach(() => {
          const call = (ErrorDisplay as jest.Mock).mock.calls[0][0];
          call.resetError();
        });

        it("should change urls to the search route", () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(mockReport.retryRoute);
        });
      });
    });

    describe("when the user has valid listens", () => {
      beforeEach(() => {
        mockUserProperties.userName = "niall-byrne";
        mockUserProperties.data.report = {
          image: [],
          playcount: 10,
          playCountByArtist: {
            content: [
              { name: "The Cure", playcount: 10, fetched: true, albums: [] },
            ],
            created: "",
            status: { complete: true, steps_complete: 1, steps_total: 1 },
          },
        };
        arrange();
      });

      it("should NOT call the ErrorDisplay component", () => {
        expect(ErrorDisplay).toBeCalledTimes(0);
      });

      it("should NOT call the Authentication component", () => {
        expect(Authentication).toBeCalledTimes(0);
      });
    });
  });
});
