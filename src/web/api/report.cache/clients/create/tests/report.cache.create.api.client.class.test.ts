import { waitFor } from "@testing-library/react";
import ReportCacheRetrieveClient from "../report.cache.create.api.client.class";
import apiRoutes from "@src/config/apiRoutes";
import { settings as cacheSettings } from "@src/config/cache";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import HttpApiClient from "@src/web/api/transport/clients/http.client.class";
import QueryString from "@src/web/ui/window/location/window.location.query.string";
import type { ReportCacheCreateClientParamsInterface } from "@src/web/api/report.cache/types/cache.report.api.client.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

jest.mock("@src/web/ui/window/location/window.location.query.string");

describe(ReportCacheRetrieveClient.name, () => {
  let cacheResult: { bypassed: boolean };
  let instance: ReportCacheRetrieveClient;
  let mockFetch: jest.SpyInstance;
  let mockTransport: jest.SpyInstance;
  let params: ReportCacheCreateClientParamsInterface;

  const reportType = "CREATE REPORT CACHE";
  const mockAPIResponse = { id: "mocked_cache_id" };

  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();

  const mockParams: ReportCacheCreateClientParamsInterface = {
    authenticatedUserName: "mock@gmail.com",
    reportName: "mock Report Name",
    sourceName: "mock Source Name",
    userName: "mockUserName",
    body: { mock: "reportJSON" } as unknown as ReportStateInterface,
  };

  const mockRequestEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "REQUEST",
    action: `${reportType}: REQUEST SENT TO CDN ORGIN.`,
  });
  const mockSuccessEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "RESPONSE",
    action: `${reportType}: SUCCESSFUL RESPONSE FROM CDN ORGIN.`,
  });
  const mockUnauthorizedEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "ERROR",
    action: `${reportType}: AN UNAUTHORIZED REQUEST WAS MADE.`,
  });
  const mockFailedEvent = new analyticsVendor.collection.EventDefinition({
    category: "CACHE",
    label: "ERROR",
    action: `${reportType}: AN ERROR OCCURRED DURING THIS REPORT CACHING REQUEST.`,
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
      expect(QueryString.prototype.get).toBeCalledTimes(1);
      expect(QueryString.prototype.get).toBeCalledWith(
        cacheSettings.cacheQueryStringIdentifier
      );
    });
  };

  const checkQueryStringRemove = () => {
    it("should remove the window query string", () => {
      expect(jest.mocked(QueryString).mock.instances[0].remove).toBeCalledTimes(
        1
      );
      expect(jest.mocked(QueryString).mock.instances[0].remove).toBeCalledWith([
        cacheSettings.cacheQueryStringIdentifier,
      ]);
    });
  };

  const checkNoQueryStringRemove = () => {
    it("should NOT attempt to remove the window query string", () => {
      expect(jest.mocked(QueryString).mock.instances[0].remove).toBeCalledTimes(
        0
      );
    });
  };

  const checkResult = (expected: boolean) => {
    it(`should return '${expected}' as the value for the 'bypass' property`, () => {
      expect(cacheResult.bypassed).toBe(expected);
    });
  };

  const checkUrl = () => {
    it("should make the request with the correct url", () => {
      expect(mockFetch).toBeCalledTimes(1);
      const expectedUrl = instance.route
        .replace(":source", encodeURIComponent(params.sourceName))
        .replace(":report", encodeURIComponent(params.reportName))
        .replace(":username", encodeURIComponent(params.userName));
      expect(mockTransport).toBeCalledWith(expectedUrl, {
        method: "POST",
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
      let returnedRoute: string;

      describe("when called", () => {
        beforeEach(() => {
          returnedRoute = instance.getRoute();
        });

        it("should return the configured route", () => {
          expect(returnedRoute).toBe(apiRoutes.v2.cache.create);
        });
      });
    });

    describe("populate", () => {
      beforeEach(() => {
        params = { ...mockParams };
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
                cacheResult = await instance.populate(params);
              });

              checkQueryStringGet();
              checkQueryStringRemove();
              checkResult(false);
              checkUrl();

              it("should dispatch the reducer correctly", async () => {
                await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "StartCreateCachedReport",
                });
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "SuccessCreateCachedReport",
                });
              });

              it("should register events correctly", async () => {
                await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
                expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
                expect(mockEvent).toHaveBeenCalledWith(mockSuccessEvent);
              });
            });
          });

          describe("when a request is unauthorized", () => {
            beforeEach(() => {
              setUpMockResponse(false, 401);
            });

            describe("when called", () => {
              beforeEach(async () => {
                cacheResult = await instance.populate(params);
              });

              checkQueryStringGet();
              checkNoQueryStringRemove();
              checkResult(false);
              checkUrl();

              it("should dispatch the reducer correctly", async () => {
                await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "StartCreateCachedReport",
                });
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "FailureCreateCachedReport",
                });
              });

              it("should register events correctly", async () => {
                await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
                expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
                expect(mockEvent).toHaveBeenCalledWith(mockUnauthorizedEvent);
              });
            });
          });

          describe("when a request returns an unknown status code", () => {
            beforeEach(() => {
              setUpMockResponse(false, 503);
            });

            describe("when called", () => {
              beforeEach(async () => {
                cacheResult = await instance.populate(params);
              });

              checkQueryStringGet();
              checkNoQueryStringRemove();
              checkResult(false);
              checkUrl();

              it("should dispatch the reducer correctly", async () => {
                await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "StartCreateCachedReport",
                });
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "FailureCreateCachedReport",
                });
              });

              it("should register events correctly", async () => {
                await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
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
                cacheResult = await instance.populate(params);
              });

              checkQueryStringGet();
              checkNoQueryStringRemove();
              checkResult(false);
              checkUrl();

              it("should dispatch the reducer correctly", async () => {
                await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "StartCreateCachedReport",
                });
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "FailureCreateCachedReport",
                });
              });

              it("should register events correctly", async () => {
                await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
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
                cacheResult = await instance.populate(params);
              });

              checkQueryStringGet();
              checkNoQueryStringRemove();
              checkResult(false);
              checkUrl();

              it("should dispatch the reducer correctly", async () => {
                await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "StartCreateCachedReport",
                });
                expect(mockDispatch).toHaveBeenCalledWith({
                  type: "FailureCreateCachedReport",
                });
              });

              it("should register events correctly", async () => {
                await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
                expect(mockEvent).toHaveBeenCalledWith(mockRequestEvent);
                expect(mockEvent).toHaveBeenCalledWith(mockFailedEvent);
              });
            });
          });
        }
      );

      describe(`with an existing ${cacheSettings.cacheQueryStringIdentifier} query string set to: '1'`, () => {
        beforeEach(() => {
          jest.mocked(QueryString.prototype.get).mockReturnValue("1");
        });

        describe("when called", () => {
          beforeEach(async () => {
            cacheResult = await instance.populate(params);
          });

          checkQueryStringGet();
          checkNoQueryStringRemove();

          it("should not call fetch", () => {
            expect(mockFetch).toBeCalledTimes(0);
          });

          it("should not dispatch an action", () => {
            expect(mockDispatch).toBeCalledTimes(0);
          });

          it("should not emit an event", () => {
            expect(mockEvent).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});
