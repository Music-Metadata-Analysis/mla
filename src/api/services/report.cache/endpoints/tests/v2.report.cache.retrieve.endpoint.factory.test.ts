import { waitFor } from "@testing-library/react";
import ReportCacheEndpointTestDoubleWithTimeoutV2 from "./implementations/v2.report.cache.retrieve.endpoint.factory.timeout.class";
import ReportCacheRetrieveEndpointFactoryV2 from "../v2.report.cache.retrieve.endpoint.factory.class";
import { mockReportCacheProxyMethods } from "@src/api/services/report.cache/proxy/__mocks__/proxy.class.mock";
import { proxyFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import { mockAuthClient } from "@src/vendors/integrations/auth/__mocks__/vendor.backend.mock";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestBodyType } from "@src/contracts/api/types/request.types";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/auth/vendor.backend");

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

jest.mock("@src/api/services/report.cache/proxy/proxy.class");

describe(ReportCacheRetrieveEndpointFactoryV2.name, () => {
  let clearTimeOutSpy: jest.SpyInstance;

  let FactoryClassSelector: new () => ReportCacheRetrieveEndpointFactoryV2;

  let factoryInstance: ReportCacheRetrieveEndpointFactoryV2;
  let method: HttpApiClientHttpMethodType;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  let payload: ApiEndpointRequestBodyType | undefined;
  let cacheId: [string] | null;
  let report: [string] | null;
  let source: string | null;
  let username: [string] | null;

  const unknownError = new Error("Unknown error");

  const mockUserName = "validUser";
  const mockValidReport = ["mockReport"] as [string];
  const mockValidSource = "mockSource";

  const mockSuccessfulProxyResponse = {
    response: "cachedReport",
    cacheControl: "max-age=150",
  };
  const mockCacheId = "mockCacheId";

  const mockLoggedErrorMessage = unknownError.toString();
  const mockLoggedInvalidResponseMessage = "Invalid response!";
  const mockLoggedSuccessMessage = "Success!";
  const mockLoggedTimedOutRequest = "Timed out! Please retry this request!";

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOutSpy = jest.spyOn(window, "clearTimeout");
  });

  const createInstance = () => {
    factoryInstance =
      new FactoryClassSelector() as ReportCacheRetrieveEndpointFactoryV2;
  };

  const arrange = async () => {
    createInstance();
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
      body: payload,
      query: {
        cache: cacheId,
        report,
        source,
        username,
      },
    }));
    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  const isEmptyEachArray = (err: Error) =>
    (err as Error).message.toString() !==
    "Error: `.each` called with an empty Array of table data.\n";

  const checkCacheControlHeader = () => {
    it("should set a retry-after header", () => {
      expect(mockRes.getHeader("Cache-Control")).toBe(
        mockSuccessfulProxyResponse.cacheControl
      );
    });
  };

  const checkCaching = () => {
    it("should call the proxy service with the correct props", () => {
      expect(mockReportCacheProxyMethods.retrieveCacheObject).toBeCalledWith({
        authenticatedUserName: mockSession?.email,
        reportName: String(report).toLowerCase(),
        sourceName: String(source).toLowerCase(),
        userName: String(username),
      });
    });
  };

  const checkNoCaching = () => {
    it("should NOT call the proxy service", () => {
      expect(mockReportCacheProxyMethods.retrieveCacheObject).toBeCalledTimes(
        0
      );
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

    if (expectedProxyResponse) {
      it("should log the correct proxy response", () => {
        const call = jest.mocked(mockEndpointLogger).mock.calls[0];
        expect(call[0].proxyResponse).toBe(
          `${factoryInstance.service}: ${expectedProxyResponse}`
        );
      });
    } else {
      it("should log the correct proxy response", () => {
        const call = jest.mocked(mockEndpointLogger).mock.calls[0];
        expect(call[0].proxyResponse).toBeUndefined();
      });
    }
  };

  const checkWithInvalidReport = () => {
    describe("with an invalid report", () => {
      beforeEach(() => {
        report = null;
      });

      describe("with a valid source", () => {
        beforeEach(() => {
          source = mockValidSource;
        });

        expect400RegardlessOfUsername();
      });

      describe("with an invalid source", () => {
        beforeEach(() => {
          source = null;
        });

        expect400RegardlessOfUsername();
      });
    });
  };

  const expect400 = () => {
    it("should return a 400", () => {
      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
    });

    checkJWT();
    checkTimeoutNotCleared();
    checkNoRetryHeader();
    checkLogger(undefined);
    checkNoCaching();
  };

  const expect400RegardlessOfUsername = () => {
    describe("with a valid username", () => {
      beforeEach(async () => {
        username = [mockUserName];
        await arrange();
      });

      expect400();
    });

    describe("with an invalid username", () => {
      beforeEach(async () => {
        username = null;
        await arrange();
      });

      expect400();
    });
  };

  const expect401 = () => {
    it("should return a 401", () => {
      expect(mockRes._getStatusCode()).toBe(401);
      expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
    });

    checkJWT();
    checkTimeoutNotCleared();
    checkNoRetryHeader();
    checkLogger(undefined);
    checkNoCaching();
  };

  const expect401RegardlessofUsernameReportSource = () => {
    describe("with a valid report", () => {
      beforeEach(() => {
        report = mockValidReport;
      });

      describe("with a valid source name", () => {
        beforeEach(() => {
          source = mockValidSource;
        });

        describe("with a valid username", () => {
          beforeEach(async () => {
            username = [mockUserName];
            await arrange();
          });

          expect401();
        });

        describe("with an invalid username", () => {
          beforeEach(async () => {
            username = null;
            await arrange();
          });

          expect401();
        });
      });

      describe("with an invalid source name", () => {
        beforeEach(() => {
          source = null;
        });

        describe("with a valid username", () => {
          beforeEach(async () => {
            username = [mockUserName];
            await arrange();
          });

          expect401();
        });

        describe("with an invalid username", () => {
          beforeEach(async () => {
            username = null;
            await arrange();
          });

          expect401();
        });
      });
    });

    describe("with an invalid report", () => {
      beforeEach(() => {
        report = null;
      });

      describe("with a valid source name", () => {
        beforeEach(() => {
          source = mockValidSource;
        });

        describe("with a valid username", () => {
          beforeEach(async () => {
            username = [mockUserName];
            await arrange();
          });

          expect401();
        });

        describe("with an invalid username", () => {
          beforeEach(async () => {
            username = null;
            await arrange();
          });

          expect401();
        });
      });

      describe("with an invalid source name", () => {
        beforeEach(() => {
          source = null;
        });

        describe("with a valid username", () => {
          beforeEach(async () => {
            username = [mockUserName];
            await arrange();
          });

          expect401();
        });

        describe("with an invalid username", () => {
          beforeEach(async () => {
            username = null;
            await arrange();
          });

          expect401();
        });
      });
    });
  };

  describe("the created instances of the factory", () => {
    beforeEach(() => {
      FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
      createInstance();
    });

    it("should have the correct route set", () => {
      expect(factoryInstance.route).toBe(apiRoutes.v2.cache.retrieve);
    });

    it("should have the correct service set", () => {
      expect(factoryInstance.service).toBe("CloudFront");
    });
  });

  describe("with an authenticated user", () => {
    beforeEach(() => {
      mockAuthClient.getSession.mockResolvedValue(mockSession);
    });

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("that generates a successful proxy response", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () => Promise.resolve(mockSuccessfulProxyResponse)
          );
        });

        describe("with a valid report", () => {
          beforeEach(() => {
            report = mockValidReport;
          });

          describe("with a valid source name", () => {
            beforeEach(() => {
              source = mockValidSource;
            });

            describe("with a valid username", () => {
              beforeEach(async () => {
                username = [mockUserName];
                await arrange();
              });

              it("should return a 200", () => {
                expect(mockRes._getStatusCode()).toBe(200);
                expect(mockRes._getJSONData()).toStrictEqual(
                  mockSuccessfulProxyResponse.response
                );
              });

              checkJWT();
              checkTimeoutCleared();
              checkNoRetryHeader();
              checkLogger(mockLoggedSuccessMessage);
              checkCaching();
              checkCacheControlHeader();
            });

            describe("with an invalid username", () => {
              beforeEach(async () => {
                username = null;
                await arrange();
              });

              expect400();
            });
          });

          describe("with an invalid source name", () => {
            beforeEach(() => {
              source = null;
            });

            expect400RegardlessOfUsername();
          });
        });

        checkWithInvalidReport();
      });

      describe("that generates an unknown proxy response", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () =>
              Promise.resolve(
                "strange string response" as unknown as ReportCacheCreateResponseInterface
              )
          );
        });

        describe("with a valid report", () => {
          beforeEach(() => {
            report = mockValidReport;
          });

          describe("with a valid source name", () => {
            beforeEach(() => {
              source = mockValidSource;
            });

            describe("with a valid username", () => {
              beforeEach(async () => {
                username = [mockUserName];
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

            describe("with an invalid username", () => {
              beforeEach(async () => {
                username = null;
                await arrange();
              });

              expect400();
            });
          });

          describe("with an invalid source name", () => {
            beforeEach(() => {
              source = null;
            });

            expect400RegardlessOfUsername();
          });
        });

        checkWithInvalidReport();
      });

      describe("that generates an unknown proxy error", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () => {
              throw unknownError;
            }
          );
        });

        describe("with a valid report", () => {
          beforeEach(() => {
            report = mockValidReport;
          });

          describe("with a valid source name", () => {
            beforeEach(() => {
              source = mockValidSource;
            });

            describe("with a valid username", () => {
              beforeEach(async () => {
                username = [mockUserName];
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

            describe("with an invalid username", () => {
              beforeEach(async () => {
                username = null;
                await arrange();
              });

              expect400();
            });
          });

          describe("with an invalid source name", () => {
            beforeEach(() => {
              source = null;
            });

            expect400RegardlessOfUsername();
          });
        });

        checkWithInvalidReport();
      });

      describe("that generates a known proxy error", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
        });

        try {
          describe.each(
            Object.entries(proxyFailureStatusCodes.reportCacheRetrieve)
          )("when the proxy error is: %s", (errorCode, statusMessage) => {
            beforeEach(() => {
              mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
                () => {
                  throw new errorVendorBackend.ProxyError(
                    "Unknown error",
                    parseInt(errorCode)
                  );
                }
              );
            });

            describe("with a valid report", () => {
              beforeEach(() => {
                report = mockValidReport;
              });

              describe("with a valid source name", () => {
                beforeEach(() => {
                  source = mockValidSource;
                });

                describe("with a valid username", () => {
                  beforeEach(async () => {
                    username = [mockUserName];
                    await arrange();
                  });

                  it(`should return a ${errorCode}`, () => {
                    expect(mockRes._getStatusCode()).toBe(parseInt(errorCode));
                    expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
                  });

                  checkJWT();
                  checkTimeoutCleared();
                  checkNoRetryHeader();
                  checkLogger(mockLoggedErrorMessage);
                  checkCaching();
                });

                describe("with an invalid username", () => {
                  beforeEach(async () => {
                    username = null;
                    await arrange();
                  });

                  expect400();
                });
              });

              describe("with an invalid source name", () => {
                beforeEach(() => {
                  source = null;
                });

                expect400RegardlessOfUsername();
              });
            });

            checkWithInvalidReport();
          });
        } catch (err) {
          if (isEmptyEachArray(err as Error)) {
            throw err;
          }
        }
      });

      describe("that times out", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheEndpointTestDoubleWithTimeoutV2;
        });

        describe("with a valid report", () => {
          beforeEach(() => {
            report = mockValidReport;
          });

          describe("with a valid source name", () => {
            beforeEach(() => {
              source = mockValidSource;
            });

            describe("with a valid username", () => {
              beforeEach(async () => {
                username = [mockUserName];
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

            describe("with an invalid username", () => {
              beforeEach(async () => {
                username = null;
                await arrange();
              });

              expect400();
            });
          });

          describe("with an invalid source name", () => {
            beforeEach(() => {
              source = null;
            });

            expect400RegardlessOfUsername();
          });
        });

        checkWithInvalidReport();
      });
    });

    describe("with a PUT request", () => {
      beforeEach(() => {
        method = "PUT" as const;
      });

      describe("with a valid cache id", () => {
        beforeEach(() => {
          cacheId = [mockCacheId];
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

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("that generates a successful proxy response", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () => Promise.resolve(mockSuccessfulProxyResponse)
          );
        });

        expect401RegardlessofUsernameReportSource();
      });

      describe("that generates an unknown proxy response", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () =>
              Promise.resolve(
                {} as unknown as ReportCacheCreateResponseInterface
              )
          );
        });

        expect401RegardlessofUsernameReportSource();
      });

      describe("that generates an unknown proxy error", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
          mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
            () => {
              throw unknownError;
            }
          );
        });

        expect401RegardlessofUsernameReportSource();
      });

      describe("that generates a known proxy error", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheRetrieveEndpointFactoryV2;
        });

        try {
          describe.each(
            Object.entries(proxyFailureStatusCodes.reportCacheRetrieve)
          )("when the proxy error is: %s", (errorCode) => {
            beforeEach(() => {
              mockReportCacheProxyMethods.retrieveCacheObject.mockImplementation(
                () => {
                  throw new errorVendorBackend.ProxyError(
                    "Unknown error",
                    parseInt(errorCode)
                  );
                }
              );
            });

            expect401RegardlessofUsernameReportSource();
          });
        } catch (err) {
          if (isEmptyEachArray(err as Error)) {
            throw err;
          }
        }
      });

      describe("that times out", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheEndpointTestDoubleWithTimeoutV2;
        });

        expect401RegardlessofUsernameReportSource();
      });
    });

    describe("with a PUT request", () => {
      beforeEach(() => {
        method = "PUT" as const;
      });

      describe("with a valid cache id", () => {
        beforeEach(() => {
          cacheId = [mockCacheId];
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
