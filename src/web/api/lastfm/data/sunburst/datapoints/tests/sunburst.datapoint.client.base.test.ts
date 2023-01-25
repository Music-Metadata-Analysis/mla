import { waitFor } from "@testing-library/react";
import LastFMBaseSunBurstDataPointClient from "../sunburst.datapoint.client.base.class";
import InitialState from "@src/providers/user/user.initial";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import HttpApiClient from "@src/web/api/transport/http.client.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

class ConcreteLastFMBaseSunBurstDataClient<
  ReportType
> extends LastFMBaseSunBurstDataPointClient<jest.Mock, ReportType> {
  route = "/api/v2/some/route/:username";
}

describe("LastFMBaseSunBurstDataClient", () => {
  let instance: ConcreteLastFMBaseSunBurstDataClient<LastFMTopAlbumsReportResponseInterface>;
  let mockRequest: jest.SpyInstance;

  const integrationType = "LAST.FM";
  const reportType = "BASE";

  const mockAPIResponse = { data: "mocked data" };
  const mockUserParams = { userName: "user1234" };
  const mockUserParamsWithArtist = { ...mockUserParams, artist: "Mock Artist" };

  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockState = {
    errorMessage: "Mock Error Message",
    lastfmPrefix: "A url to lastfm",
    userProperties: JSON.parse(JSON.stringify(InitialState)),
    getReportContent: jest.fn(),
    getReport: jest.fn(),
    getReportStatus: jest.fn(),
    getDispatchState: jest.fn(),
    updateWithResponse: jest.fn(),
    getProfileImageUrl: jest.fn(),
    getNextStep: jest.fn(),
    throwError: jest.fn(),
    removeEntity: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = jest.spyOn(HttpApiClient.prototype, "request");
  });

  const arrange = () => {
    const report =
      new ConcreteLastFMBaseSunBurstDataClient<LastFMTopAlbumsReportResponseInterface>(
        mockDispatch,
        mockEvent,
        mockState
      );
    return report;
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockRequest).toBeCalledTimes(1);
      expect(mockRequest).toBeCalledWith(
        instance.route?.replace(":username", mockUserParams.userName)
      );
    });
  };

  const setUpRetrieve = (success: boolean, status: number, headers = {}) => {
    if (success) {
      mockRequest.mockResolvedValueOnce({
        status: status,
        headers: headers,
        response: mockAPIResponse,
      });
    } else {
      mockRequest.mockRejectedValueOnce({});
    }
  };

  describe("retrieveReport", () => {
    const mockCompleteReport = { report: "complete" };
    const mockInCompleteReport = { report: "incomplete" };

    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
      });

      describe("when the report is complete", () => {
        beforeEach(() => {
          mockState.getReportStatus.mockReturnValueOnce({
            complete: true,
          });
          mockState.getDispatchState.mockReturnValueOnce(mockCompleteReport);
          instance = arrange();
        });

        describe("when called with initial params", () => {
          beforeEach(() => {
            instance.retrieveReport(mockUserParams);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParams,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "SuccessFetch",
              userName: mockUserParams.userName,
              data: mockCompleteReport,
              integration: integrationType,
            });
          });
        });

        describe("when called with non-initial params", () => {
          beforeEach(() => {
            instance.retrieveReport(mockUserParamsWithArtist);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParamsWithArtist,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "SuccessFetch",
              userName: mockUserParamsWithArtist.userName,
              data: mockCompleteReport,
              integration: integrationType,
            });
          });

          it("should NOT emit any analytics events", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });
      });

      describe("when the report is not complete", () => {
        beforeEach(() => {
          mockState.getReportStatus.mockReturnValueOnce({
            complete: false,
          });
          mockState.getDispatchState.mockReturnValueOnce(mockInCompleteReport);
          instance = arrange();
        });

        describe("when called with initial params", () => {
          beforeEach(() => {
            instance.retrieveReport(mockUserParams);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParams,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointSuccessFetch",
              data: mockInCompleteReport,
            });
          });

          it("should NOT emit any analytics events", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(() => {
            instance.retrieveReport(mockUserParamsWithArtist);
          });

          checkUrl();

          it("should attempt to update the report based on the api response", () => {
            expect(mockState.updateWithResponse).toBeCalledTimes(1);
            expect(mockState.updateWithResponse).toBeCalledWith(
              mockAPIResponse,
              mockUserParamsWithArtist,
              instance.route
            );
          });

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointSuccessFetch",
              data: mockInCompleteReport,
            });
          });

          it("should NOT emit any analytics events", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        mockState.getDispatchState.mockReturnValueOnce(mockCompleteReport);
        instance = arrange();
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "FailureFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(0);
        });

        it("should emit an analytics event for the error", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: ERROR DURING REQUEST.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParamsWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointFailureFetch",
            data: mockCompleteReport,
          });
        });

        it("should remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(1);
          expect(mockState.removeEntity).toBeCalledWith(
            mockUserParamsWithArtist
          );
        });

        it("should NOT emit any analytics events", () => {
          expect(mockEvent).toBeCalledTimes(0);
        });
      });
    });

    describe("when a request is unauthorized", () => {
      beforeEach(() => {
        setUpRetrieve(true, 401);
        mockState.getDispatchState.mockReturnValueOnce(mockCompleteReport);
        instance = arrange();
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "UnauthorizedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should emit an analytics event for an unauthorized request", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParamsWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "UnauthorizedFetch",
            userName: mockUserParamsWithArtist.userName,
            integration: integrationType,
          });
        });

        it("should emit an analytics event for an unauthorized request", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
            })
          );
        });
      });
    });

    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        mockState.getDispatchState.mockReturnValueOnce(mockCompleteReport);
        instance = arrange();
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "NotFoundFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(0);
        });

        it("should emit an analytics event for the unknown entity", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParamsWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointNotFoundFetch",
            data: mockCompleteReport,
          });
        });

        it("should remove the entity", () => {
          expect(mockState.removeEntity).toBeCalledTimes(1);
          expect(mockState.removeEntity).toBeCalledWith(
            mockUserParamsWithArtist
          );
        });

        it("should NOT emit any analytics events", () => {
          expect(mockEvent).toBeCalledTimes(0);
        });
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
        instance = arrange();
      });

      describe("when called with initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParams);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "StartFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "RatelimitedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should emit and analytics event for being ratelimited", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
            })
          );
        });
      });

      describe("when called with NON initial params", () => {
        beforeEach(() => {
          instance.retrieveReport(mockUserParamsWithArtist);
        });

        checkUrl();

        it("should dispatch the reducer correctly", async () => {
          await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "DataPointStartFetch",
          });
          expect(mockDispatch).toHaveBeenCalledWith({
            type: "RatelimitedFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should emit and analytics event for being ratelimited", () => {
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(
            new analyticsVendor.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
            })
          );
        });
      });
    });

    describe("when a request time out", () => {
      beforeEach(() => {
        mockState.getDispatchState.mockReturnValueOnce(mockInCompleteReport);
      });

      const waitForBackOff = async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
      };

      describe("with a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503, { "retry-after": "0" });
          instance = arrange();
        });

        describe("when called with initial params", () => {
          beforeEach(async () => {
            instance.retrieveReport(mockUserParams);
            await waitForBackOff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointTimeoutFetch",
            });
          });

          it("should NOT emit any analytics events", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(async () => {
            instance.retrieveReport(mockUserParamsWithArtist);
            await waitForBackOff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointTimeoutFetch",
            });
          });

          it("should NOT emit any analytics events", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });
      });

      describe("without a retry header", () => {
        beforeEach(() => {
          setUpRetrieve(true, 503);
          instance = arrange();
        });

        describe("when called with initial params", () => {
          beforeEach(async () => {
            instance.retrieveReport(mockUserParams);
            await waitForBackOff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "StartFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "FailureFetch",
              userName: mockUserParams.userName,
              integration: integrationType,
            });
          });

          it("should register an analytics event for the error", () => {
            expect(mockEvent).toBeCalledTimes(1);
            expect(mockEvent).toHaveBeenCalledWith(
              new analyticsVendor.EventDefinition({
                category: "LAST.FM",
                label: "ERROR",
                action: `${reportType}: ERROR DURING REQUEST.`,
              })
            );
          });
        });

        describe("when called with NON initial params", () => {
          beforeEach(async () => {
            instance.retrieveReport(mockUserParamsWithArtist);
            await waitForBackOff();
          });

          checkUrl();

          it("should dispatch the reducer correctly", async () => {
            await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "DataPointStartFetch",
            });
            expect(mockDispatch).toHaveBeenCalledWith({
              type: "FailureFetch",
              userName: mockUserParamsWithArtist.userName,
              integration: integrationType,
            });
          });

          it("should register an analytics event for the error", () => {
            expect(mockEvent).toBeCalledTimes(1);
            expect(mockEvent).toHaveBeenCalledWith(
              new analyticsVendor.EventDefinition({
                category: "LAST.FM",
                label: "ERROR",
                action: `${reportType}: ERROR DURING REQUEST.`,
              })
            );
          });
        });
      });
    });
  });
});
