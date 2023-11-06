import { waitFor } from "@testing-library/react";
import ConcreteV2EndpointWithProxyError from "./implementations/concrete.v2.lastfm.proxy.error.class";
import ConcreteV2EndpointWithProxyResponseError from "./implementations/concrete.v2.lastfm.proxy.response.error.class";
import ConcreteV2EndpointWithProxySuccess from "./implementations/concrete.v2.lastfm.proxy.success.class";
import ConcreteV2EndpointWithProxyTimeout from "./implementations/concrete.v2.lastfm.timeout.error.class";
import LastFMApiEndpointFactoryBaseV2 from "../v2.lastfm.endpoint.factory.base.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import { mockAuthClient } from "@src/vendors/integrations/auth/__mocks__/vendor.backend.mock";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { mockFlagClient } from "@src/vendors/integrations/flags/__mocks__/vendor.backend.mock";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/auth/vendor.backend");

jest.mock("@src/vendors/integrations/flags/vendor.backend");

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe(LastFMApiEndpointFactoryBaseV2.name, () => {
  let clearTimeOutSpy: jest.SpyInstance;

  let factoryInstance: LastFMApiEndpointFactoryBaseV2 & {
    errorCode?: number;
    flag: string | null;
  };

  let method: HttpApiClientHttpMethodType;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let originalEnvironment: typeof process.env;

  let requiredFlag: string | null;
  let username: [string] | null;

  const mockFlagEnvironment = "MockValue2";

  const mockLoggedErrorMessage = "Error: mockError";
  const mockLoggedInvalidResponseMessage = "Invalid response, please retry.";
  const mockLoggedSuccessMessage = "Success!";
  const mockLoggedTimedOutRequest = "Timed out! Please retry this request!";

  beforeAll(() => {
    originalEnvironment = process.env;
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOutSpy = jest.spyOn(window, "clearTimeout");
  });

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
      query: { username },
    }));
    factoryInstance["flag"] = requiredFlag;
    await factoryInstance.createHandler()(mockReq, mockRes);
  };

  const setupEnv = () => {
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagEnvironment;
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

  const checkFeatureFlagLookup = ({
    expectedCalls,
  }: {
    expectedCalls: number;
  }) => {
    it(`should check the flag's status`, () => {
      expect(flagVendorBackend.Client).toHaveBeenCalledTimes(expectedCalls);
      expect(mockFlagClient.isEnabled).toHaveBeenCalledTimes(expectedCalls);
    });

    it("should instantiate Flagsmith with the correct environment", () => {
      expect(flagVendorBackend.Client).toHaveBeenCalledWith(
        mockFlagEnvironment
      );
    });
  };

  const checkNoFeatureFlagLookup = () => {
    it("should NOT check the flag's status", () => {
      expect(flagVendorBackend.Client).toHaveBeenCalledTimes(0);
      expect(mockFlagClient.isEnabled).toHaveBeenCalledTimes(0);
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
      expect(call.length).toBe(2);
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

  describe("with an authenticated user", () => {
    beforeEach(() => {
      mockAuthClient.getSession.mockResolvedValue(mockSession);
    });

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUser"];
        });

        describe("with a bypassed flag", () => {
          beforeEach(async () => (requiredFlag = null));

          describe("receives a request with a successful proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 200", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getJSONData()).toStrictEqual([]);
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutCleared();
            checkNoRetryHeader();
            checkLogger(mockLoggedSuccessMessage);
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutCleared();
            checkRetryHeader();
            checkLogger(mockLoggedInvalidResponseMessage);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 502", () => {
              expect(mockRes._getStatusCode()).toBe(502);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutCleared();
            checkNoRetryHeader();
            checkLogger(mockLoggedErrorMessage);
          });

          describe.each(Object.entries(proxyFailureStatusCodes.lastfm))(
            "receives a request that generates a known proxy error (%s)",

            (errorCode, statusMessage) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointWithProxyError();
                factoryInstance.errorCode = parseInt(errorCode);
                await arrange();
              });

              it(`should return a ${errorCode}`, () => {
                expect(mockRes._getStatusCode()).toBe(parseInt(errorCode));
                expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
              });

              checkJWT();
              checkNoFeatureFlagLookup();
              checkTimeoutCleared();
              checkNoRetryHeader();
              checkLogger(mockLoggedErrorMessage);
            }
          );

          describe("receives a request that times out", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkRetryHeader();
            checkLogger(mockLoggedTimedOutRequest);
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request with a successful proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 200", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getJSONData()).toStrictEqual([]);
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutCleared();
            checkNoRetryHeader();
            checkLogger(mockLoggedSuccessMessage);
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutCleared();
            checkRetryHeader();
            checkLogger(mockLoggedInvalidResponseMessage);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 502", () => {
              expect(mockRes._getStatusCode()).toBe(502);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutCleared();
            checkNoRetryHeader();
            checkLogger(mockLoggedErrorMessage);
          });

          describe.each(Object.entries(proxyFailureStatusCodes.lastfm))(
            "receives a request that generates a known proxy error (%s)",

            (errorCode, statusMessage) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointWithProxyError();
                factoryInstance.errorCode = parseInt(errorCode);
                await arrange();
              });

              it(`should return a ${errorCode}`, () => {
                expect(mockRes._getStatusCode()).toBe(parseInt(errorCode));
                expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
              });

              checkJWT();
              checkFeatureFlagLookup({ expectedCalls: 1 });
              checkTimeoutCleared();
              checkNoRetryHeader();
              checkLogger(mockLoggedErrorMessage);
            }
          );

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutNotCleared();
            checkRetryHeader();
            checkLogger(mockLoggedTimedOutRequest);
          });
        });

        describe("with an disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request with a successful proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe.each(Object.entries(proxyFailureStatusCodes.lastfm))(
            "receives a request that generates a known proxy error (%s)",

            (errorCode) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointWithProxyError();
                factoryInstance.errorCode = parseInt(errorCode);
                await arrange();
              });

              it(`should return a 404`, () => {
                expect(mockRes._getStatusCode()).toBe(404);
                expect(mockRes._getJSONData()).toStrictEqual(
                  status.STATUS_404_MESSAGE
                );
              });

              checkJWT();
              checkFeatureFlagLookup({ expectedCalls: 1 });
              checkTimeoutNotCleared();
              checkNoRetryHeader();
              checkLogger();
            }
          );

          describe("receives a request that times out", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();
            checkFeatureFlagLookup({ expectedCalls: 1 });
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });
      });

      describe("with an invalid username", () => {
        beforeEach(() => {
          username = null;
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = null;
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with a bypassed flag", () => {
          beforeEach(async () => (requiredFlag = null));

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });
      });
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUsername"];
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV2EndpointWithProxySuccess();
            await arrange();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });

          checkNoJWT();
          checkNoFeatureFlagLookup();
          checkTimeoutNotCleared();
          checkNoRetryHeader();
          checkLogger();
        });
      });
    });
  });

  describe("with an UNAUTHENTICATED user", () => {
    beforeEach(() => mockAuthClient.getSession.mockResolvedValue(null));

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUser"];
        });

        describe("with an bypassed flag", () => {
          beforeEach(async () => {
            requiredFlag = null;
          });

          describe("receives a request with a successful proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxySuccess();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyResponseError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyError();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });
      });

      describe("with an invalid username", () => {
        beforeEach(() => {
          username = null;
        });

        describe("with a bypassed flag", () => {
          beforeEach(async () => {
            requiredFlag = null;
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });
      });
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid username", () => {
        beforeEach(async () => {
          username = ["validUser"];
        });

        describe("with a bypassed flag", () => {
          beforeEach(async () => {
            requiredFlag = null;
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkNoJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkNoJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointWithProxyTimeout();
              await arrange();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkNoJWT();
            checkNoFeatureFlagLookup();
            checkTimeoutNotCleared();
            checkNoRetryHeader();
            checkLogger();
          });
        });
      });
    });
  });
});
