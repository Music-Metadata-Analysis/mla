import { waitFor } from "@testing-library/react";
import ConcreteReportCacheEndpointFactoryV2Success, {
  mockValidator as mockConcreteValidator,
} from "./implementations/concrete.v2.report.cache.endpoint.factory.success.class";
import ConcreteReportCacheEndpointFactoryV2Timeout, {
  mockValidator as mockConcreteTimeoutValidator,
} from "./implementations/concrete.v2.report.cache.endpoint.factory.timeout.class";
import { mockReportCacheProxyMethods } from "@src/api/services/report.cache/proxy/__mocks__/proxy.class.mock";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import { mockAuthClient } from "@src/vendors/integrations/auth/__mocks__/vendor.backend.mock";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type ReportCacheEndpointAbstractFactoryV2 from "../v2.report.cache.endpoint.abstract.factory.class";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestBodyType } from "@src/contracts/api/types/request.types";
import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/api/services/report.cache/proxy/proxy.class");

jest.mock("@src/vendors/integrations/auth/vendor.backend");

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

jest.mock("@src/vendors/integrations/cache/vendor.backend");

describe("ReportCacheEndpointAbstractFactoryV2", () => {
  let clearTimeOutSpy: jest.SpyInstance;

  let concreteFactoryClassSelector: new () => ReportCacheEndpointAbstractFactoryV2;
  let concreteValidatorSelection: jest.Mock;

  let factoryInstance: ReportCacheEndpointAbstractFactoryV2 & {
    errorCode?: number;
  };

  let method: HttpApiClientHttpMethodType;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  let payload: ApiEndpointRequestBodyType | undefined;
  let report: [string] | null;
  let source: string | null;

  let username: [string] | null;

  const unknownError = new Error("Unknown error");

  const mockCacheId = "mockCacheId";
  const mockInvalidPayload = undefined;
  const mockObjectName = "mockObjectName";
  const mockSuccessfulProxyResponse = {
    id: "mock cache id",
  } as const;
  const mockValidPayload = { mock: "payload" };
  const mockValidReport = ["mockReport"] as [string];
  const mockValidSource = "mockSource";

  const mockLoggedErrorMessage = unknownError.toString();
  const mockLoggedInvalidResponseMessage = "Invalid response!";
  const mockLoggedSuccessMessage = "Success!";
  const mockLoggedTimedOutRequest = "Timed out! Please retry this request!";

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOutSpy = jest.spyOn(window, "clearTimeout");
    jest
      .mocked(
        cacheVendorBackend.CdnOriginReportsCacheObject.prototype.getCacheId
      )
      .mockImplementation(() => mockCacheId);
    jest
      .mocked(
        cacheVendorBackend.CdnOriginReportsCacheObject.prototype.getStorageName
      )
      .mockImplementation(() => mockObjectName);
  });

  const arrange = async () => {
    factoryInstance = new concreteFactoryClassSelector();
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
      body: payload,
      query: { report, source, username },
    }));
    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  const checkCaching = () => {
    it("should use the CdnOriginReports class to create a storage name", () => {
      expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBeCalledTimes(1);
      expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBeCalledWith({
        authenticatedUserName: "mock@gmail.com",
        sourceName: mockValidSource.toLowerCase(),
        reportName: String(mockValidReport).toLowerCase(),
        userName: String(username),
      });
    });

    it("should generate a cache id", () => {
      expect(
        jest.mocked(cacheVendorBackend.CdnOriginReportsCacheObject).mock
          .instances[0].getCacheId
      ).toBeCalledTimes(1);
    });

    it("should generate a storage name", () => {
      expect(
        jest.mocked(cacheVendorBackend.CdnOriginReportsCacheObject).mock
          .instances[0].getStorageName
      ).toBeCalledTimes(1);
    });

    it("should call the proxy service with the correct props", () => {
      expect(mockReportCacheProxyMethods.createCacheObject).toBeCalledWith({
        cacheId: mockCacheId,
        objectContent: mockValidPayload,
        objectName: mockObjectName,
      });
    });
  };

  const checkNoCaching = () => {
    it("should NOT instantiate the CdnOriginReports class", () => {
      expect(cacheVendorBackend.CdnOriginReportsCacheObject).toBeCalledTimes(0);
    });

    it("should NOT call the proxy service", () => {
      expect(mockReportCacheProxyMethods.createCacheObject).toBeCalledTimes(0);
    });
  };

  const checkJWT = () => {
    it("should instantiate the authentication client as expected", () => {
      expect(authVendorBackend.Client).toBeCalledTimes(1);
      expect(authVendorBackend.Client).toBeCalledWith(mockReq);
    });

    it("should call the getSession method with the correct props", () => {
      expect(mockAuthClient.getSession).toBeCalledTimes(1);
      expect(mockAuthClient.getSession).toBeCalledWith();
    });
  };

  const checkNoJWT = () => {
    it("should NOT instantiate the authentication client", () => {
      expect(authVendorBackend.Client).toBeCalledTimes(0);
    });
  };

  const checkTimeoutCleared = () => {
    it("should clear the timeout", async () => {
      await waitFor(() => expect(clearTimeOutSpy).toBeCalledTimes(1));
    });
  };

  const checkTimeoutNotCleared = () => {
    it("should NOT clear the timeout", () => {
      expect(clearTimeOutSpy).toBeCalledTimes(0);
    });
  };

  const checkRetryHeader = () => {
    it("should set a retry-after header", () => {
      expect(mockRes.getHeader("retry-after")).toBe(0);
    });
  };

  const checkNoRetryHeader = () => {
    it("should NOT set a retry-after header", () => {
      expect(mockRes.getHeader("retry-after")).toBeUndefined();
    });
  };

  const checkLogger = (expectedProxyResponse?: string) => {
    it("should log a message", () => {
      expect(mockEndpointLogger).toBeCalledTimes(1);

      const call = jest.mocked(mockEndpointLogger).mock.calls[0];
      expect(call[0]).toBe(mockReq);
      expect(call[1]).toBe(mockRes);
      expect(call[2]).toBeInstanceOf(Function);
      expect(call[2].name).toBe("next");
      expect(call.length).toBe(3);
    });

    it("should log the correct proxy response", () => {
      const call = jest.mocked(mockEndpointLogger).mock.calls[0];
      if (expectedProxyResponse) {
        expect(call[0].proxyResponse).toBe(
          `${factoryInstance.service}: ${expectedProxyResponse}`
        );
      } else {
        expect(call[0].proxyResponse).toBeUndefined();
      }
    });
  };

  const expect400RegardlessOfPayload = () => {
    describe("with a valid payload", () => {
      beforeEach(async () => {
        concreteValidatorSelection.mockImplementation(() => ({
          valid: true,
        }));
        payload = mockValidPayload;
        await arrange();
      });

      it("should return a 400", () => {
        expect(mockRes._getStatusCode()).toBe(400);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
      });

      checkJWT();
      checkTimeoutNotCleared();
      checkNoRetryHeader();
      checkLogger(undefined);
      checkNoCaching();
    });

    describe("with an invalid payload", () => {
      beforeEach(async () => {
        concreteValidatorSelection.mockImplementation(() => ({
          valid: false,
        }));
        payload = mockInvalidPayload;
        await arrange();
      });

      it("should return a 400", () => {
        expect(mockRes._getStatusCode()).toBe(400);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
      });

      checkJWT();
      checkTimeoutNotCleared();
      checkNoRetryHeader();
      checkLogger(undefined);
      checkNoCaching();
    });
  };

  const expect401RegardlessOfPayload = () => {
    describe("with a valid payload", () => {
      beforeEach(async () => {
        concreteValidatorSelection.mockImplementation(() => ({
          valid: true,
        }));
        payload = mockValidPayload;
        await arrange();
      });

      it("should return a 401", () => {
        expect(mockRes._getStatusCode()).toBe(401);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
      });

      checkJWT();
      checkTimeoutNotCleared();
      checkNoRetryHeader();
      checkLogger(undefined);
      checkNoCaching();
    });

    describe("with an invalid payload", () => {
      beforeEach(async () => {
        concreteValidatorSelection.mockImplementation(() => ({
          valid: false,
        }));
        payload = mockInvalidPayload;
        await arrange();
      });

      it("should return a 401", () => {
        expect(mockRes._getStatusCode()).toBe(401);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
      });

      checkJWT();
      checkTimeoutNotCleared();
      checkNoRetryHeader();
      checkLogger(undefined);
      checkNoCaching();
    });
  };

  describe("with an authenticated user", () => {
    beforeEach(() => {
      mockAuthClient.getSession.mockResolvedValue(mockSession);
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("that generates a successful proxy response", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          concreteValidatorSelection = mockConcreteValidator;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve(mockSuccessfulProxyResponse)
          );
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              describe("with a valid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: true,
                  }));
                  payload = mockValidPayload;
                  await arrange();
                });

                it("should return a 201", () => {
                  expect(mockRes._getStatusCode()).toBe(201);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    mockSuccessfulProxyResponse
                  );
                });

                checkJWT();
                checkTimeoutCleared();
                checkNoRetryHeader();
                checkLogger(mockLoggedSuccessMessage);
                checkCaching();
              });

              describe("with an invalid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: false,
                  }));
                  payload = mockInvalidPayload;
                  await arrange();
                });

                it("should return a 400", () => {
                  expect(mockRes._getStatusCode()).toBe(400);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_400_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutNotCleared();
                checkNoRetryHeader();
                checkLogger(undefined);
                checkNoCaching();
              });
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });
      });

      describe("that generates an unknown proxy response", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          concreteValidatorSelection = mockConcreteValidator;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve({} as unknown as ReportCacheResponseInterface)
          );
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              describe("with a valid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: true,
                  }));
                  payload = mockValidPayload;
                  await arrange();
                });

                it("should return a 502", () => {
                  expect(mockRes._getStatusCode()).toBe(502);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_502_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutCleared();
                checkNoRetryHeader();
                checkLogger(mockLoggedInvalidResponseMessage);
                checkCaching();
              });

              describe("with an invalid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: false,
                  }));
                  payload = mockInvalidPayload;
                  await arrange();
                });

                it("should return a 400", () => {
                  expect(mockRes._getStatusCode()).toBe(400);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_400_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutNotCleared();
                checkNoRetryHeader();
                checkLogger(undefined);
                checkNoCaching();
              });
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid source name", () => {
            beforeEach(() => {
              source = mockValidSource;
            });

            expect400RegardlessOfPayload();
          });

          describe("with an invalid source name", () => {
            beforeEach(() => {
              source = null;
            });

            expect400RegardlessOfPayload();
          });
        });
      });

      describe("that generates an unknown proxy error", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          concreteValidatorSelection = mockConcreteValidator;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(
            () => {
              throw new Error("Unknown error");
            }
          );
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              describe("with a valid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: true,
                  }));
                  payload = mockValidPayload;
                  await arrange();
                });

                it("should return a 502", () => {
                  expect(mockRes._getStatusCode()).toBe(502);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_502_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutCleared();
                checkNoRetryHeader();
                checkLogger(mockLoggedErrorMessage);
                checkCaching();
              });

              describe("with an invalid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: false,
                  }));
                  payload = mockInvalidPayload;
                  await arrange();
                });

                it("should return a 400", () => {
                  expect(mockRes._getStatusCode()).toBe(400);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_400_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutNotCleared();
                checkNoRetryHeader();
                checkLogger(undefined);
                checkNoCaching();
              });
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });
      });

      describe("that generates a known proxy error", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          concreteValidatorSelection = mockConcreteValidator;
        });

        describe.each([
          ["unauthorized", 401, status.STATUS_401_MESSAGE],
          ["notfound", 404, status.STATUS_404_MESSAGE],
          ["ratelimited", 429, status.STATUS_429_MESSAGE],
          ["unavailable", 503, status.STATUS_503_MESSAGE],
        ])(
          "when the proxy error is: %s",
          (errorMsg, errorCode, statusMessage) => {
            beforeEach(() => {
              mockReportCacheProxyMethods.createCacheObject.mockImplementation(
                () => {
                  throw new errorVendorBackend.ProxyError(
                    "Unknown error",
                    errorCode
                  );
                }
              );
            });

            describe("with a valid username", () => {
              beforeEach(() => {
                username = ["validUser"];
              });

              describe("with a valid report name", () => {
                beforeEach(() => {
                  report = mockValidReport;
                });

                describe("with a valid source name", () => {
                  beforeEach(() => {
                    source = mockValidSource;
                  });

                  describe("with a valid payload", () => {
                    beforeEach(async () => {
                      concreteValidatorSelection.mockImplementation(() => ({
                        valid: true,
                      }));
                      payload = mockValidPayload;
                      await arrange();
                    });

                    it(`should return a ${errorCode}`, () => {
                      expect(mockRes._getStatusCode()).toBe(errorCode);
                      expect(mockRes._getJSONData()).toStrictEqual(
                        statusMessage
                      );
                    });

                    checkJWT();
                    checkTimeoutCleared();
                    checkNoRetryHeader();
                    checkLogger(mockLoggedErrorMessage);
                    checkCaching();
                  });

                  describe("with an invalid payload", () => {
                    beforeEach(async () => {
                      concreteValidatorSelection.mockImplementation(() => ({
                        valid: false,
                      }));
                      payload = mockInvalidPayload;
                      await arrange();
                    });

                    it("should return a 400", () => {
                      expect(mockRes._getStatusCode()).toBe(400);
                      expect(mockRes._getJSONData()).toStrictEqual(
                        status.STATUS_400_MESSAGE
                      );
                    });

                    checkJWT();
                    checkTimeoutNotCleared();
                    checkNoRetryHeader();
                    checkLogger(undefined);
                    checkNoCaching();
                  });
                });

                describe("with an invalid source name", () => {
                  beforeEach(() => {
                    source = null;
                  });

                  expect400RegardlessOfPayload();
                });
              });

              describe("with an invalid report name", () => {
                beforeEach(() => {
                  report = null;
                });

                describe("with a valid source name", () => {
                  beforeEach(() => {
                    source = mockValidSource;
                  });

                  expect400RegardlessOfPayload();
                });

                describe("with an invalid source name", () => {
                  beforeEach(() => {
                    source = null;
                  });

                  expect400RegardlessOfPayload();
                });
              });
            });

            describe("with an invalid username", () => {
              beforeEach(() => {
                username = null;
              });

              describe("with a valid report name", () => {
                beforeEach(() => {
                  report = mockValidReport;
                });

                describe("with a valid source name", () => {
                  beforeEach(() => {
                    source = mockValidSource;
                  });

                  expect400RegardlessOfPayload();
                });

                describe("with an invalid source name", () => {
                  beforeEach(() => {
                    source = null;
                  });

                  expect400RegardlessOfPayload();
                });
              });

              describe("with an invalid report name", () => {
                beforeEach(() => {
                  report = null;
                });

                describe("with a valid source name", () => {
                  beforeEach(() => {
                    source = mockValidSource;
                  });

                  expect400RegardlessOfPayload();
                });

                describe("with an invalid source name", () => {
                  beforeEach(() => {
                    source = null;
                  });

                  expect400RegardlessOfPayload();
                });
              });
            });
          }
        );
      });

      describe("that times out", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Timeout;
          concreteValidatorSelection = mockConcreteTimeoutValidator;
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              describe("with a valid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: true,
                  }));
                  payload = mockValidPayload;
                  await arrange();
                });

                it("should return a 503", () => {
                  expect(mockRes._getStatusCode()).toBe(503);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_503_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutNotCleared();
                checkRetryHeader();
                checkLogger(mockLoggedTimedOutRequest);
                checkCaching();
              });

              describe("with an invalid payload", () => {
                beforeEach(async () => {
                  concreteValidatorSelection.mockImplementation(() => ({
                    valid: false,
                  }));
                  payload = mockInvalidPayload;
                  await arrange();
                });

                it("should return a 400", () => {
                  expect(mockRes._getStatusCode()).toBe(400);
                  expect(mockRes._getJSONData()).toStrictEqual(
                    status.STATUS_400_MESSAGE
                  );
                });

                checkJWT();
                checkTimeoutNotCleared();
                checkNoRetryHeader();
                checkLogger(undefined);
                checkNoCaching();
              });
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect400RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect400RegardlessOfPayload();
            });
          });
        });
      });
    });

    describe("with a PUT request", () => {
      beforeEach(() => {
        method = "PUT" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUsername"];
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            await arrange();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });

          checkNoJWT();
          checkTimeoutNotCleared();
          checkNoRetryHeader();
          checkLogger(undefined);
          checkNoCaching();
        });
      });
    });
  });

  describe("with an unauthenticated user", () => {
    beforeEach(() => {
      mockAuthClient.getSession.mockResolvedValue(null);
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("that generates a successful proxy response", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve(mockSuccessfulProxyResponse)
          );
          concreteValidatorSelection = mockConcreteValidator;
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });
      });

      describe("that generates an unknown proxy response", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve(null as unknown as ReportCacheResponseInterface)
          );
          concreteValidatorSelection = mockConcreteValidator;
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });
      });

      describe("that generates an unknown proxy error", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(
            () => {
              throw new Error("Unknown error");
            }
          );
          concreteValidatorSelection = mockConcreteValidator;
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });
      });

      describe("that generates a known proxy error", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Success;
          concreteValidatorSelection = mockConcreteValidator;
        });

        describe.each([
          ["unauthorized", 401, status.STATUS_401_MESSAGE],
          ["notfound", 404, status.STATUS_404_MESSAGE],
          ["ratelimited", 429, status.STATUS_429_MESSAGE],
          ["unavailable", 503, status.STATUS_503_MESSAGE],
        ])("when the proxy error is: %s", (errorMsg, errorCode) => {
          beforeEach(() => {
            mockReportCacheProxyMethods.createCacheObject.mockImplementation(
              () => {
                throw new errorVendorBackend.ProxyError(
                  "Unknown error",
                  errorCode
                );
              }
            );
          });

          describe("with a valid username", () => {
            beforeEach(() => {
              username = ["validUser"];
            });

            describe("with a valid report name", () => {
              beforeEach(() => {
                report = mockValidReport;
              });

              describe("with a valid source name", () => {
                beforeEach(() => {
                  source = mockValidSource;
                });

                expect401RegardlessOfPayload();
              });

              describe("with an invalid source name", () => {
                beforeEach(() => {
                  source = null;
                });

                expect401RegardlessOfPayload();
              });
            });

            describe("with an invalid report name", () => {
              beforeEach(() => {
                report = null;
              });

              describe("with a valid source name", () => {
                beforeEach(() => {
                  source = mockValidSource;
                });

                expect401RegardlessOfPayload();
              });

              describe("with an invalid source name", () => {
                beforeEach(() => {
                  source = null;
                });

                expect401RegardlessOfPayload();
              });
            });
          });

          describe("with an invalid username", () => {
            beforeEach(() => {
              username = null;
            });

            describe("with a valid report name", () => {
              beforeEach(() => {
                report = mockValidReport;
              });

              describe("with a valid source name", () => {
                beforeEach(() => {
                  source = mockValidSource;
                });

                expect401RegardlessOfPayload();
              });

              describe("with an invalid source name", () => {
                beforeEach(() => {
                  source = null;
                });

                expect401RegardlessOfPayload();
              });
            });

            describe("with an invalid report name", () => {
              beforeEach(() => {
                report = null;
              });

              describe("with a valid source name", () => {
                beforeEach(() => {
                  source = mockValidSource;
                });

                expect401RegardlessOfPayload();
              });

              describe("with an invalid source name", () => {
                beforeEach(() => {
                  source = null;
                });

                expect401RegardlessOfPayload();
              });
            });
          });
        });
      });

      describe("that times out", () => {
        beforeEach(() => {
          concreteFactoryClassSelector =
            ConcreteReportCacheEndpointFactoryV2Timeout;
          concreteValidatorSelection = mockConcreteTimeoutValidator;
        });

        describe("with a valid username", () => {
          beforeEach(() => {
            username = ["validUser"];
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = mockValidReport;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });

        describe("with an invalid username", () => {
          beforeEach(() => {
            username = null;
          });

          describe("with a valid report name", () => {
            beforeEach(() => {
              report = ["playCountByArtist"];
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });

          describe("with an invalid report name", () => {
            beforeEach(() => {
              report = null;
            });

            describe("with a valid source name", () => {
              beforeEach(() => {
                source = mockValidSource;
              });

              expect401RegardlessOfPayload();
            });

            describe("with an invalid source name", () => {
              beforeEach(() => {
                source = null;
              });

              expect401RegardlessOfPayload();
            });
          });
        });
      });
    });

    describe("with a PUT request", () => {
      beforeEach(() => {
        method = "PUT" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUsername"];
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            await arrange();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });

          checkNoJWT();
          checkTimeoutNotCleared();
          checkNoRetryHeader();
          checkLogger(undefined);
          checkNoCaching();
        });
      });
    });
  });
});
