import { waitFor } from "@testing-library/react";
import ConcreteLastFMBaseClient from "./implementations/concrete.lastfm.api.client.base";
import settings from "@src/config/lastfm";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import HttpApiClient from "@src/web/api/transport/clients/http.client.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.albums.types";

describe("LastFMBaseClient", () => {
  let instance: ConcreteLastFMBaseClient<LastFMTopAlbumsReportResponseInterface>;
  let mockHttpClientRequest: jest.SpyInstance;
  let mockFetch: jest.SpyInstance;

  const integrationType = "LAST.FM";
  const reportType = "BASE";

  const mockAPIResponse = { data: "mocked data" };
  const mockUserParams = { userName: "user12+34" };
  const mockUserParamsWithArtist = { ...mockUserParams, artist: "The Cure" };

  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();

  const requestEvent = new analyticsVendor.collection.EventDefinition({
    category: "LAST.FM",
    label: "REQUEST",
    action: `${reportType}: REQUEST WAS SENT TO LAST.FM.`,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.spyOn(window, "fetch");
    mockHttpClientRequest = jest.spyOn(HttpApiClient.prototype, "request");
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
      expect(mockHttpClientRequest).toBeCalledTimes(1);
      expect(mockHttpClientRequest).toBeCalledWith(
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
      expect(mockHttpClientRequest).toBeCalledTimes(1);
      expect(mockHttpClientRequest).toBeCalledWith(expectedRoute);
    });
  };

  const setUpFetch = (
    success: boolean,
    status: number,
    headers: [string, string][] = []
  ) => {
    mockFetch.mockResolvedValueOnce({
      ok: success,
      status: status,
      headers: headers,
      json: () => mockAPIResponse,
    });
  };

  describe("when instantiated", () => {
    beforeEach(() => {
      instance = arrange();
    });

    describe("getRoute", () => {
      let returnedRoute: string;

      describe("when called", () => {
        beforeEach(() => {
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
          setUpFetch(true, 200);
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
              userProfile: `${settings.homePage}/user/${mockUserParams.userName}`,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
            expect(mockEvent).toHaveBeenCalledWith(
              new analyticsVendor.collection.EventDefinition({
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
              data: mockAPIResponse,
              integration: integrationType,
              userName: mockUserParams.userName,
              userProfile: `${settings.homePage}/user/${mockUserParams.userName}`,
            });
          });

          it("should register events correctly", async () => {
            await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
            expect(mockEvent).toHaveBeenCalledWith(requestEvent);
            expect(mockEvent).toHaveBeenCalledWith(
              new analyticsVendor.collection.EventDefinition({
                category: "LAST.FM",
                label: "RESPONSE",
                action: `${reportType}: RECEIVED RESPONSE FROM LAST.FM.`,
              })
            );
          });
        });
      });

      describe("when a request fails due to network problems", () => {
        beforeEach(() => {
          mockFetch.mockRejectedValueOnce({});

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
            new analyticsVendor.collection.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: ERROR DURING REQUEST.`,
            })
          );
        });
      });

      describe("when a request is unauthorized", () => {
        beforeEach(() => {
          setUpFetch(false, 401);

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
            new analyticsVendor.collection.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
            })
          );
        });
      });

      describe("when a request returns not found", () => {
        beforeEach(() => {
          setUpFetch(false, 404);

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
            new analyticsVendor.collection.EventDefinition({
              category: "LAST.FM",
              label: "ERROR",
              action: `${reportType}: REQUEST WAS MADE FOR AN UNKNOWN ENTITY.`,
            })
          );
        });
      });

      describe("when a request is ratelimited", () => {
        beforeEach(() => {
          setUpFetch(false, 429);

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
            new analyticsVendor.collection.EventDefinition({
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
            setUpFetch(false, 503, [["retry-after", "0"]]);
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
            setUpFetch(false, 503);
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
              new analyticsVendor.collection.EventDefinition({
                category: "LAST.FM",
                label: "ERROR",
                action: `${reportType}: ERROR DURING REQUEST.`,
              })
            );
          });
        });
      });

      describe("when a request fails due to any other status code", () => {
        beforeEach(() => {
          setUpFetch(false, 400);

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
            new analyticsVendor.collection.EventDefinition({
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
