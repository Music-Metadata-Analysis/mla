import { waitFor } from "@testing-library/react";
import ReportCacheRetrieveClient from "../report.cache.retrieve.api.client.class";
import apiRoutes from "@src/config/apiRoutes";
import { settings as cacheSettings } from "@src/config/cache";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import HttpApiClient from "@src/web/api/transport/clients/http.client.class";
import QueryString from "@src/web/ui/window/location/window.location.query.string";
import type { ReportCacheRetrieveClientParamsInterface } from "@src/web/api/report.cache/types/cache.report.api.client.types";

jest.mock("@src/web/ui/window/location/window.location.query.string");

describe(ReportCacheRetrieveClient.name, () => {
  let originalEnvironment: typeof process.env;
  let cacheResult: { bypassed: boolean };
  let instance: ReportCacheRetrieveClient;
  let mockFetch: jest.SpyInstance;
  let mockTransport: jest.SpyInstance;
  let params: ReportCacheRetrieveClientParamsInterface;

  const reportType = "RETRIEVE REPORT CACHE";
  const mockAPIResponse = { mockReportData: "mockReportData" };
  const mockCdnHostname = "mock.hostname.com";

  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();

  const mockParams: ReportCacheRetrieveClientParamsInterface = {
    authenticatedUserName: "mock@gmail.com",
    reportName: "mock Report Name",
    sourceName: "TEST",
    userName: "mockUserName",
  };

  const mockRequestEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "REQUEST",
    action: `${reportType}: REQUEST SENT TO CDN.`,
  });
  const mockSuccessEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "RESPONSE",
    action: `${reportType}: CACHE HIT FROM CDN.`,
  });
  const mockNotFoundEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "RESPONSE",
    action: `${reportType}: CACHE MISS FROM CDN.`,
  });
  const mockFailedEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "ERROR",
    action: `${reportType}: AN ERROR OCCURRED RETRIEVING THIS CACHED REPORT.`,
  });

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.NEXT_PUBLIC_CACHING_SERVER_DOMAIN_NAME = mockCdnHostname;
  });

  beforeAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.spyOn(window, "fetch");
    mockTransport = jest.spyOn(HttpApiClient.prototype, "request");
  });

  const arrange = () =>
    (instance = new ReportCacheRetrieveClient(mockDispatch, mockEvent));

  const checkQueryStringGet = () => {
    it("should call the get method of the QueryString class as expected", () => {
      expect(QueryString.prototype.get).toHaveBeenCalledTimes(1);
      expect(QueryString.prototype.get).toHaveBeenCalledWith(
        cacheSettings.cacheQueryStringIdentifier
      );
    });
  };

  const checkQueryStringUpdate = () => {
    it("should call the update method of the QueryString class as expected", () => {
      expect(QueryString.prototype.update).toHaveBeenCalledTimes(1);
      expect(QueryString.prototype.update).toHaveBeenCalledWith({
        [cacheSettings.cacheQueryStringIdentifier]: "1",
      });
    });
  };

  const checkNoQueryStringUpdate = () => {
    it("should NOT call the remove method of the QueryString class", () => {
      expect(QueryString.prototype.update).toHaveBeenCalledTimes(0);
    });
  };

  const checkResult = (expected: boolean) => {
    it(`should return '${expected}' as the value for the 'bypassed' property`, () => {
      expect(cacheResult.bypassed).toBe(expected);
    });
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const expectedUrl =
        instance.route
          .replace(
            ":source",
            encodeURIComponent(params.sourceName.toLowerCase())
          )
          .replace(
            ":report",
            encodeURIComponent(params.reportName.toLowerCase())
          ) +
        "?" +
        new URLSearchParams({ username: params.userName }).toString();
      expect(mockTransport).toHaveBeenCalledWith(expectedUrl, {
        method: "GET",
        body: params.body,
      });
    });
  };

  const setUpMockResponse = (
    success: boolean,
    status: number,
    headers = []
  ) => {
    mockFetch.mockResolvedValue({
      ok: success,
      status: status,
      headers: headers,
      json: () => mockAPIResponse,
    });
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    describe("getRoute", () => {
      let returnedUrl: string;

      describe("when called", () => {
        beforeEach(() => {
          returnedUrl = instance.getRoute();
        });

        it("should return the configured route", () => {
          expect(returnedUrl).toBe(apiRoutes.v2.cache);
        });
      });
    });
  });

  describe("lookup", () => {
    beforeEach(() => {
      params = { ...mockParams };
      arrange();
    });

    describe.each([[null], ["non_bypass_indicator"]])(
      `with the ${cacheSettings.cacheQueryStringIdentifier} query string set to: '%s'`,
      (queryStringValue) => {
        beforeEach(() => {
          jest
            .mocked(QueryString.prototype.get)
            .mockReturnValue(queryStringValue);
        });

        describe("when a request is successful", () => {
          beforeEach(() => {
            setUpMockResponse(true, 201);
          });

          describe("when called", () => {
            beforeEach(async () => {
              cacheResult = await instance.lookup(params);
            });

            checkQueryStringGet();
            checkUrl();
            checkResult(false);
            checkQueryStringUpdate();

            it("should dispatch the reducer correctly", async () => {
              await waitFor(() =>
                expect(mockDispatch).toHaveBeenCalledTimes(2)
              );
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "StartRetrieveCachedReport",
                integration: "TEST",
                userName: mockParams.userName,
              });
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "SuccessRetrieveCachedReport",
                cachedReportState: mockAPIResponse,
              });
            });

            it("should register events correctly", async () => {
              await waitFor(() => expect(mockEvent).toHaveBeenCalledTimes(2));
              expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
              expect(mockEvent).toHaveBeenCalledWith(mockSuccessEvent);
            });
          });
        });

        describe("when a request is notfound", () => {
          beforeEach(() => {
            setUpMockResponse(false, 404);
          });

          describe("when called", () => {
            beforeEach(async () => {
              cacheResult = await instance.lookup(params);
            });

            checkQueryStringGet();
            checkUrl();
            checkResult(false);
            checkNoQueryStringUpdate();

            it("should dispatch the reducer correctly", async () => {
              await waitFor(() =>
                expect(mockDispatch).toHaveBeenCalledTimes(2)
              );
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "StartRetrieveCachedReport",
                integration: "TEST",
                userName: mockParams.userName,
              });
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "FailureRetrieveCachedReport",
              });
            });

            it("should register events correctly", async () => {
              await waitFor(() => expect(mockEvent).toHaveBeenCalledTimes(2));
              expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
              expect(mockEvent).toHaveBeenCalledWith(mockNotFoundEvent);
            });
          });
        });

        describe("when a request returns an unknown status code", () => {
          beforeEach(() => {
            setUpMockResponse(false, 503);
          });

          describe("when called", () => {
            beforeEach(async () => {
              cacheResult = await instance.lookup(params);
            });

            checkQueryStringGet();
            checkUrl();
            checkResult(false);
            checkNoQueryStringUpdate();

            it("should dispatch the reducer correctly", async () => {
              await waitFor(() =>
                expect(mockDispatch).toHaveBeenCalledTimes(2)
              );
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "StartRetrieveCachedReport",
                integration: "TEST",
                userName: mockParams.userName,
              });
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "FailureRetrieveCachedReport",
              });
            });

            it("should register events correctly", async () => {
              await waitFor(() => expect(mockEvent).toHaveBeenCalledTimes(2));
              expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
              expect(mockEvent).toHaveBeenCalledWith(mockFailedEvent);
            });
          });
        });

        describe("when a request returns an unexpected response", () => {
          beforeEach(() => {
            mockFetch.mockResolvedValue({});
          });

          describe("when called", () => {
            beforeEach(async () => {
              cacheResult = await instance.lookup(params);
            });

            checkQueryStringGet();
            checkUrl();
            checkResult(false);
            checkNoQueryStringUpdate();

            it("should dispatch the reducer correctly", async () => {
              await waitFor(() =>
                expect(mockDispatch).toHaveBeenCalledTimes(2)
              );
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "StartRetrieveCachedReport",
                integration: "TEST",
                userName: mockParams.userName,
              });
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "FailureRetrieveCachedReport",
              });
            });

            it("should register events correctly", async () => {
              await waitFor(() => expect(mockEvent).toHaveBeenCalledTimes(2));
              expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
              expect(mockEvent).toHaveBeenCalledWith(mockFailedEvent);
            });
          });
        });

        describe("when a request fails due to a network error", () => {
          beforeEach(() => {
            mockFetch.mockRejectedValue({});
          });

          describe("when called", () => {
            beforeEach(async () => {
              cacheResult = await instance.lookup(params);
            });

            checkQueryStringGet();
            checkUrl();
            checkResult(false);
            checkNoQueryStringUpdate();

            it("should dispatch the reducer correctly", async () => {
              await waitFor(() =>
                expect(mockDispatch).toHaveBeenCalledTimes(2)
              );
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "StartRetrieveCachedReport",
                integration: "TEST",
                userName: mockParams.userName,
              });
              expect(mockDispatch).toHaveBeenCalledWith({
                type: "FailureRetrieveCachedReport",
              });
            });

            it("should register events correctly", async () => {
              await waitFor(() => expect(mockEvent).toHaveBeenCalledTimes(2));
              expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
              expect(mockEvent).toHaveBeenCalledWith(mockFailedEvent);
            });
          });
        });
      }
    );

    describe(`with the ${cacheSettings.cacheQueryStringIdentifier} query string set to: '0'`, () => {
      beforeEach(() => {
        jest.mocked(QueryString.prototype.get).mockReturnValue("0");
      });

      describe("when called", () => {
        beforeEach(async () => {
          cacheResult = await instance.lookup(params);
        });

        checkQueryStringGet();
        checkResult(true);
        checkNoQueryStringUpdate();

        it("should not call fetch", () => {
          expect(mockFetch).toHaveBeenCalledTimes(0);
        });

        it("should not dispatch an action", () => {
          expect(mockDispatch).toHaveBeenCalledTimes(0);
        });

        it("should not emit an event", () => {
          expect(mockEvent).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
