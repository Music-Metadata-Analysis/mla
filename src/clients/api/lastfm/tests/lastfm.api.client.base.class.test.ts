import { waitFor } from "@testing-library/react";
import LastFMReportBaseClient from "../lastfm.api.client.base.class";
import HttpApiClient from "@src/clients/api/http/http.client.class";
import EventDefinition from "@src/contracts/events/event.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";

class ConcreteLastFMBaseClient<
  ReportType
> extends LastFMReportBaseClient<ReportType> {
  route = "/api/v2/some/route/:username";
}

describe("LastFMBaseClient", () => {
  let instance: ConcreteLastFMBaseClient<LastFMTopAlbumsReportResponseInterface>;
  let mockRequest: jest.SpyInstance;

  const integrationType = "LAST.FM";
  const reportType = "BASE";

  const mockAPIResponse = { data: "mocked data" };
  const mockUserParams = { userName: "user12+34" };
  const mockUserParamsWithArtist = { ...mockUserParams, artist: "The Cure" };

  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();

  const requestEvent = new EventDefinition({
    category: "LAST.FM",
    label: "REQUEST",
    action: `${reportType}: REQUEST WAS SENT TO LAST.FM.`,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = jest.spyOn(HttpApiClient.prototype, "request");
  });

  const arrange = () => {
    const report =
      new ConcreteLastFMBaseClient<LastFMTopAlbumsReportResponseInterface>(
        mockDispatch,
        mockEvent
      );
    return report;
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockRequest).toBeCalledTimes(1);
      expect(mockRequest).toBeCalledWith(
        instance.route?.replace(
          ":username",
          encodeURIComponent(mockUserParams.userName)
        )
      );
    });
  };

  const checkUrlWithQueryString = () => {
    it("should make the request with the correct url and querystring", () => {
      let expectedRoute = instance.route?.replace(
        ":artist",
        encodeURIComponent(mockUserParamsWithArtist.artist)
      );
      expectedRoute += `?username=${encodeURIComponent(
        mockUserParamsWithArtist.userName
      )}`;
      expect(mockRequest).toBeCalledTimes(1);
      expect(mockRequest).toBeCalledWith(expectedRoute);
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

  describe("getRoute", () => {
    let returnedRoute: string;

    describe("when called", () => {
      beforeEach(() => {
        instance = arrange();

        returnedRoute = instance.getRoute();
      });

      it("should return the configured route", () => {
        expect(returnedRoute).toBe(instance.route);
      });
    });
  });

  describe("retrieveReport", () => {
    describe("when a request is successful", () => {
      beforeEach(() => {
        setUpRetrieve(true, 200);
        instance = arrange();
      });

      describe("with a route containing the username", () => {
        beforeEach(() => {
          instance.route = "/api/v2/some/route/:username";

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
            type: "SuccessFetch",
            userName: mockUserParams.userName,
            data: mockAPIResponse,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "RESPONSE",
              action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
            })
          );
        });
      });

      describe("with a route NOT containing the username", () => {
        beforeEach(() => {
          instance.route = "/api/v2/some/route/:artist";

          instance.retrieveReport(mockUserParamsWithArtist);
        });

        checkUrlWithQueryString();

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
            data: mockAPIResponse,
            integration: integrationType,
          });
        });

        it("should register events correctly", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
              category: "LAST.FM",
              label: "RESPONSE",
              action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
            })
          );
        });
      });
    });

    describe("when a request fails", () => {
      beforeEach(() => {
        setUpRetrieve(false, 400);
        instance = arrange();

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

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: ERROR DURING REQUEST.`,
          })
        );
      });
    });

    describe("when a request is unauthorized", () => {
      beforeEach(() => {
        setUpRetrieve(true, 401);
        instance = arrange();

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

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
          })
        );
      });
    });

    describe("when a request returns not found", () => {
      beforeEach(() => {
        setUpRetrieve(true, 404);
        instance = arrange();

        instance.retrieveReport(mockUserParams);
      });

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

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
          })
        );
      });
    });

    describe("when a request is ratelimited", () => {
      beforeEach(() => {
        setUpRetrieve(true, 429);
        instance = arrange();

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

      it("should register events correctly", async () => {
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        expect(mockEvent).toHaveBeenCalledWith(
          new EventDefinition({
            category: "LAST.FM",
            label: "ERROR",
            action: `${reportType}: REQUEST WAS RATELIMITED BY LAST.FM.`,
          })
        );
      });
    });

    describe("when a request time out", () => {
      const waitForBackOff = async () => {
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
      };

      describe("with a retry header", () => {
        beforeEach(async () => {
          setUpRetrieve(true, 503, { "retry-after": "0" });
          instance = arrange();

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
            type: "TimeoutFetch",
            userName: mockUserParams.userName,
            integration: integrationType,
          });
        });

        it("should NOT register events", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(1));
          expect(mockEvent).toBeCalledTimes(1);
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
        });
      });

      describe("without a retry header", () => {
        beforeEach(async () => {
          setUpRetrieve(true, 503);
          instance = arrange();

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

        it("should register a failure event", async () => {
          await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
          expect(mockEvent).toHaveBeenCalledWith(requestEvent);
          expect(mockEvent).toHaveBeenCalledWith(
            new EventDefinition({
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
