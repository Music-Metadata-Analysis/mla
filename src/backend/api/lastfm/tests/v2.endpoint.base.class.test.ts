import { waitFor } from "@testing-library/react";
import LastFMApiEndpointFactoryV2 from "../v2.endpoint.base.class";
import { mockAuthClient } from "@src/backend/integrations/auth/__mocks__/vendor.mock";
import authVendor from "@src/backend/integrations/auth/vendor";
import { mockFlagClient } from "@src/backend/integrations/flags/__mocks__/vendor.mock";
import flagVendor from "@src/backend/integrations/flags/vendor";
import * as status from "@src/config/status";
import { ProxyError } from "@src/errors/proxy.error.class";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type {
  QueryParamType,
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

class ConcreteTimeoutClass extends LastFMApiEndpointFactoryV2 {
  route = "/api/v2/endpoint/:username";
  timeOut = 100;
  delay = 1;
  flag = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: QueryParamType) {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await sleep(this.timeOut * 2);
    return {
      expired: "expired",
    };
  }
}

class ConcreteErrorClass extends LastFMApiEndpointFactoryV2 {
  route = "/api/v2/endpoint/:username";
  mockError = "mockError";
  errorCode?: number;
  delay = 1;
  flag = null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: QueryParamType) {
    throw new ProxyError(this.mockError, this.errorCode);
    return {
      error: "error",
    };
  }
}

class ConcreteProxyErrorClass extends LastFMApiEndpointFactoryV2 {
  route = "/api/v2/endpoint/:username";
  delay = 1;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: QueryParamType) {
    return undefined as never as unknown[];
  }
}

jest.mock("@src/backend/integrations/auth/vendor");

jest.mock("@src/backend/integrations/flags/vendor");

jest.mock("@src/backend/api/lastfm/endpoint.common.logger");

describe("LastFMApiEndpointFactoryV2", () => {
  let clearTimeOut: jest.SpyInstance;
  let factory:
    | LastFMApiEndpointFactoryV2
    | ConcreteTimeoutClass
    | ConcreteErrorClass;
  let method: HttpMethodType;
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  let originalEnvironment: typeof process.env;
  let requiredFlag: string | null;
  let username: [string] | null;

  const mockJWTSecret = "MockValue1";
  const mockFlagEnvironment = "MockValue2";

  const setupEnv = () => {
    process.env.AUTH_MASTER_JWT_SECRET = mockJWTSecret;
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT = mockFlagEnvironment;
  };

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOut = jest.spyOn(window, "clearTimeout");
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

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

  const checkFeatureFlagLookup = ({
    expectedCalls,
  }: {
    expectedCalls: number;
  }) => {
    it(`should${
      expectedCalls > 0 ? " " : " NOT "
    }check the flag's status`, () => {
      expect(flagVendor.Client).toBeCalledTimes(expectedCalls);
      expect(mockFlagClient.isEnabled).toBeCalledTimes(expectedCalls);
    });

    if (expectedCalls > 0) {
      it("should instantiate Flagsmith with the correct environment", () => {
        expect(flagVendor.Client).toBeCalledWith(mockFlagEnvironment);
      });
    }
  };

  const checkTimeoutCleared = () => {
    it("should clear the timeout", async () => {
      await waitFor(() => expect(clearTimeOut).toBeCalledTimes(1));
    });
  };

  const checkTimeoutNotCleared = () => {
    it("should NOT clear the timeout", () => {
      expect(clearTimeOut).toBeCalledTimes(0);
    });
  };

  const actRequest = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factory.route,
      method,
      query: { username },
    }));
    factory.flag = requiredFlag;
    await factory.create()(mockReq, mockRes);
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

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 502", () => {
              expect(mockRes._getStatusCode()).toBe(502);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutCleared();
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutCleared();
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
            });

            it("should return a 429", () => {
              expect(mockRes._getStatusCode()).toBe(429);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_429_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });

          describe("receives a request that generates an not found proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 404;
              await actRequest();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
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
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutCleared();
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
            });

            it("should return a 429", () => {
              expect(mockRes._getStatusCode()).toBe(429);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_429_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutCleared();
          });

          describe("receives a request that generates an not found proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 404;
              await actRequest();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutCleared();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutNotCleared();
          });
        });

        describe("with an disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
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
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(undefined);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutNotCleared();
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
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
          });

          describe("receives a request that generates an not found proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 404;
              await actRequest();
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
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 404", () => {
              expect(mockRes._getStatusCode()).toBe(404);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(undefined);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });

            checkTimeoutNotCleared();
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
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with a bypassed flag", () => {
          beforeEach(async () => (requiredFlag = null));

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 400", () => {
              expect(mockRes._getStatusCode()).toBe(400);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
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
            factory = new ConcreteTimeoutClass();
            await actRequest();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });
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

          describe("receives a request that generates any proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request that generates any proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates any proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
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
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(mockRes._getStatusCode()).toBe(401);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
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
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockFlagClient.isEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 405", () => {
              expect(mockRes._getStatusCode()).toBe(405);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });

            checkTimeoutNotCleared();
          });
        });
      });
    });
  });
});
