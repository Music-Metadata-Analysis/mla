import { waitFor } from "@testing-library/react";
import ConcreteV2EndpointProxyErrorClass from "./implementations/concrete.v2.proxy.error.class";
import ConcreteV2EndpointProxyResponseErrorClass from "./implementations/concrete.v2.proxy.response.error.class";
import ConcreteV2EndpointTimeoutErrorClass from "./implementations/concrete.v2.timeout.error.class";
import { mockEndpointLogger } from "@src/backend/api/integrations/api.logger/__mocks__/vendor.mock";
import { mockAuthClient } from "@src/backend/api/integrations/auth/__mocks__/vendor.mock";
import authVendor from "@src/backend/api/integrations/auth/vendor";
import { mockFlagClient } from "@src/backend/api/integrations/flags/__mocks__/vendor.mock";
import flagVendor from "@src/backend/api/integrations/flags/vendor";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type LastFMApiEndpointFactoryV2 from "../v2.endpoint.base.class";
import type { MockAPIRequestType } from "@src/backend/api/types/services/request.types";
import type { MockAPIResponseType } from "@src/backend/api/types/services/response.types";
import type { APIClientHttpMethodType } from "@src/contracts/api/exports.types";

jest.mock("@src/backend/api/integrations/auth/vendor");

jest.mock("@src/backend/api/integrations/flags/vendor");

jest.mock("@src/backend/api/integrations/api.logger/vendor");

describe("LastFMApiEndpointFactoryV2", () => {
  let clearTimeOutSpy: jest.SpyInstance;

  let factoryInstance: LastFMApiEndpointFactoryV2 & {
    errorCode?: number;
    flag: string | null;
  };

  let method: APIClientHttpMethodType;
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;

  let originalEnvironment: typeof process.env;

  let requiredFlag: string | null;
  let username: [string] | null;

  const mockFlagEnvironment = "MockValue2";

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
      expect(authVendor.Client).toBeCalledTimes(1);
      expect(authVendor.Client).toBeCalledWith(mockReq);
    });

    it("should call the getSession method with the correct props", () => {
      expect(mockAuthClient.getSession).toBeCalledTimes(1);
      expect(mockAuthClient.getSession).toBeCalledWith();
    });
  };

  const checkNoJWT = () => {
    it("should NOT instantiate the authentication client", () => {
      expect(authVendor.Client).toBeCalledTimes(0);
    });
  };

  const checkFeatureFlagLookup = ({
    expectedCalls,
  }: {
    expectedCalls: number;
  }) => {
    it(`should check the flag's status`, () => {
      expect(flagVendor.Client).toBeCalledTimes(expectedCalls);
      expect(mockFlagClient.isEnabled).toBeCalledTimes(expectedCalls);
    });

    it("should instantiate Flagsmith with the correct environment", () => {
      expect(flagVendor.Client).toBeCalledWith(mockFlagEnvironment);
    });
  };

  const checkNoFeatureFlagLookup = () => {
    it("should NOT check the flag's status", () => {
      expect(flagVendor.Client).toBeCalledTimes(0);
      expect(mockFlagClient.isEnabled).toBeCalledTimes(0);
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

  const checkLogger = () => {
    it("should log a message", () => {
      expect(mockEndpointLogger).toBeCalledTimes(1);

      const call = jest.mocked(mockEndpointLogger).mock.calls[0];
      expect(call[0]).toBe(mockReq);
      expect(call[1]).toBe(mockRes);
      expect(call[2]).toBeInstanceOf(Function);
      expect(call[2].name).toBe("next");
      expect(call.length).toBe(3);
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

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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
            checkLogger();
          });

          describe.each([
            ["unauthorized", 401, status.STATUS_401_MESSAGE],
            ["notfound", 404, status.STATUS_404_MESSAGE],
            ["ratelimited", 429, status.STATUS_429_MESSAGE],
            ["unavailable", 503, status.STATUS_503_MESSAGE],
          ])(
            "receives a request that generates a known proxy error (%s)",

            (errorMsg, errorCode, statusMessage) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointProxyErrorClass();
                factoryInstance.errorCode = errorCode;
                await arrange();
              });

              it(`should return a ${errorCode}`, () => {
                expect(mockRes._getStatusCode()).toBe(errorCode);
                expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
              });

              checkJWT();
              checkNoFeatureFlagLookup();
              checkTimeoutCleared();
              checkNoRetryHeader();
              checkLogger();
            }
          );

          describe("receives a request that times out", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
            checkLogger();
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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
            checkLogger();
          });

          describe.each([
            ["unauthorized", 401, status.STATUS_401_MESSAGE],
            ["notfound", 404, status.STATUS_404_MESSAGE],
            ["ratelimited", 429, status.STATUS_429_MESSAGE],
            ["unavailable", 503, status.STATUS_503_MESSAGE],
          ])(
            "receives a request that generates a known proxy error (%s)",

            (errorMsg, errorCode, statusMessage) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointProxyErrorClass();
                factoryInstance.errorCode = errorCode;
                await arrange();
              });

              it(`should return a ${errorCode}`, () => {
                expect(mockRes._getStatusCode()).toBe(errorCode);
                expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
              });

              checkJWT();
              checkFeatureFlagLookup({ expectedCalls: 1 });
              checkTimeoutCleared();
              checkNoRetryHeader();
              checkLogger();
            }
          );

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
            checkLogger();
          });
        });

        describe("with an disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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

          describe.each([
            ["unauthorized", 401],
            ["notfound", 404],
            ["ratelimited", 429],
            ["unavailable", 503],
          ])(
            "receives a request that generates a known proxy error (%s)",

            (errorMsg, errorCode) => {
              beforeEach(async () => {
                factoryInstance = new ConcreteV2EndpointProxyErrorClass();
                factoryInstance.errorCode = errorCode;
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
            factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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

          describe("receives a request that generates an unknown proxy response", () => {
            beforeEach(async () => {
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyResponseErrorClass();
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
              factoryInstance = new ConcreteV2EndpointProxyErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
              factoryInstance = new ConcreteV2EndpointTimeoutErrorClass();
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
