import { waitFor } from "@testing-library/react";
import ReportCacheCreateEndpointV2TestDouble, {
  mockValidator as mockConcreteValidator,
} from "./implementations/v2.report.cache.create.endpoint.factory.success.class";
import ReportCacheEndpointTestDoubleWithTimeoutV2, {
  mockValidator as mockConcreteTimeoutValidator,
} from "./implementations/v2.report.cache.create.endpoint.factory.timeout.class";
import ReportCacheCreateEndpointFactoryV2 from "../v2.report.cache.create.endpoint.factory.class";
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

jest.mock("@src/api/services/report.cache/proxy/proxy.class");

jest.mock("@src/vendors/integrations/auth/vendor.backend");

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe(ReportCacheCreateEndpointFactoryV2.name, () => {
  let clearTimeOutSpy: jest.SpyInstance;

  let FactoryClassSelector: new () => ReportCacheCreateEndpointFactoryV2;
  let concreteValidatorSelection: jest.Mock;

  let factoryInstance: ReportCacheCreateEndpointFactoryV2 & {
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

  const mockInvalidPayload = undefined;
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
  });

  const arrange = async () => {
    createInstance();
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
      body: payload,
      query: { report, source, username },
    }));
    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  const createInstance = () => {
    factoryInstance = new FactoryClassSelector();
  };

  const isEmptyEachArray = (err: Error) =>
    (err as Error).message.toString() !==
    "Error: `.each` called with an empty Array of table data.\n";

  const checkProxyCall = () => {
    it("should call the proxy service with the correct props", () => {
      expect(
        mockReportCacheProxyMethods.createCacheObject
      ).toHaveBeenCalledWith({
        authenticatedUserName: mockSession?.email,
        reportName: String(report).toLowerCase(),
        sourceName: String(source).toLowerCase(),
        userName: String(username),
        content: mockValidPayload,
      });
    });
  };

  const checkNoProxyCall = () => {
    it("should NOT call the proxy service", () => {
      expect(
        mockReportCacheProxyMethods.createCacheObject
      ).toHaveBeenCalledTimes(0);
    });
  };

  const checkJWT = () => {
    it("should instantiate the authentication client as expected", () => {
      expect(authVendorBackend.Client).toHaveBeenCalledTimes(1);
      expect(authVendorBackend.Client).toHaveBeenCalledWith(mockReq);
    });

    it("should call the getSession method with the correct props", () => {
      expect(mockAuthClient.getSession).toHaveBeenCalledTimes(1);
      expect(mockAuthClient.getSession).toHaveBeenCalledWith();
    });
  };

  const checkNoJWT = () => {
    it("should NOT instantiate the authentication client", () => {
      expect(authVendorBackend.Client).toHaveBeenCalledTimes(0);
    });
  };

  const checkTimeoutCleared = () => {
    it("should clear the timeout", async () => {
      await waitFor(() => expect(clearTimeOutSpy).toHaveBeenCalledTimes(1));
    });
  };

  const checkTimeoutNotCleared = () => {
    it("should NOT clear the timeout", () => {
      expect(clearTimeOutSpy).toHaveBeenCalledTimes(0);
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
      expect(mockEndpointLogger).toHaveBeenCalledTimes(1);

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
      checkNoProxyCall();
    });

    describe("with an invalid cache id", () => {
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
      checkNoProxyCall();
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
      checkNoProxyCall();
    });

    describe("with an invalid cache id", () => {
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
      checkNoProxyCall();
    });
  };

  describe("the created instances of the factory", () => {
    beforeEach(() => {
      FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
      createInstance();
    });

    it("should have the correct route set", () => {
      expect(factoryInstance.route).toBe(apiRoutes.v2.cache.create);
    });

    it("should have the correct service set", () => {
      expect(factoryInstance.service).toBe("S3");
    });
  });

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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
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
                checkProxyCall();
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
                checkNoProxyCall();
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          concreteValidatorSelection = mockConcreteValidator;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve({} as unknown as ReportCacheCreateResponseInterface)
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
                checkProxyCall();
              });

              describe("with an invalid cache id", () => {
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
                checkNoProxyCall();
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          concreteValidatorSelection = mockConcreteValidator;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(
            () => {
              throw unknownError;
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
                checkProxyCall();
              });

              describe("with an invalid cache id", () => {
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
                checkNoProxyCall();
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          concreteValidatorSelection = mockConcreteValidator;
        });

        try {
          describe.each(
            Object.entries(proxyFailureStatusCodes.reportCacheCreate)
          )("when the proxy error is: %s", (errorCode, statusMessage) => {
            beforeEach(() => {
              mockReportCacheProxyMethods.createCacheObject.mockImplementation(
                () => {
                  throw new errorVendorBackend.ProxyError(
                    "Unknown error",
                    parseInt(errorCode)
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
                      expect(mockRes._getStatusCode()).toBe(
                        parseInt(errorCode)
                      );
                      expect(mockRes._getJSONData()).toStrictEqual(
                        statusMessage
                      );
                    });

                    checkJWT();
                    checkTimeoutCleared();
                    checkNoRetryHeader();
                    checkLogger(mockLoggedErrorMessage);
                    checkProxyCall();
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
                    checkNoProxyCall();
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
        } catch (err) {
          if (isEmptyEachArray(err as Error)) {
            throw err;
          }
        }
      });

      describe("that times out", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheEndpointTestDoubleWithTimeoutV2;
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
                checkProxyCall();
              });

              describe("with an invalid cache id", () => {
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
                checkNoProxyCall();
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
          checkNoProxyCall();
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(() =>
            Promise.resolve({} as unknown as ReportCacheCreateResponseInterface)
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          mockReportCacheProxyMethods.createCacheObject.mockImplementation(
            () => {
              throw unknownError;
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
          FactoryClassSelector = ReportCacheCreateEndpointV2TestDouble;
          concreteValidatorSelection = mockConcreteValidator;
        });

        try {
          describe.each(
            Object.entries(proxyFailureStatusCodes.reportCacheCreate)
          )("when the proxy error is: %s", (errorCode) => {
            beforeEach(() => {
              mockReportCacheProxyMethods.createCacheObject.mockImplementation(
                () => {
                  throw new errorVendorBackend.ProxyError(
                    "Unknown error",
                    parseInt(errorCode)
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
        } catch (err) {
          if (isEmptyEachArray(err as Error)) {
            throw err;
          }
        }
      });

      describe("that times out", () => {
        beforeEach(() => {
          FactoryClassSelector = ReportCacheEndpointTestDoubleWithTimeoutV2;
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
          checkNoProxyCall();
        });
      });
    });
  });
});
