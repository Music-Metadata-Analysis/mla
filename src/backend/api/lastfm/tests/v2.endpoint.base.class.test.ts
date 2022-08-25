import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import * as status from "../../../../config/status";
import { ProxyError } from "../../../../errors/proxy.error.class";
import flagVendor from "../../../integrations/flags/vendor";
import LastFMApiEndpointFactoryV2 from "../v2.endpoint.base.class";
import type { QueryParamType } from "../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

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

jest.mock("../../../integrations/flags/vendor", () => ({
  Client: jest.fn(() => ({
    isEnabled: mockIsFeatureEnabled,
  })),
}));

jest.mock("../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockIsFeatureEnabled = jest.fn();

describe("LastFMApiEndpointFactoryV2", () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  let factory:
    | LastFMApiEndpointFactoryV2
    | ConcreteTimeoutClass
    | ConcreteErrorClass;
  let method: HttpMethodType;
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
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const checkJWT = () => {
    it("should call getToken with the correct props", () => {
      expect(getToken).toBeCalledTimes(1);
      const call = (getToken as jest.Mock).mock.calls[0][0];
      expect(call.req).toBe(req);
      expect(call.secret).toBe(mockJWTSecret);
      expect(Object.keys(call).length).toBe(2);
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
      expect(mockIsFeatureEnabled).toBeCalledTimes(expectedCalls);
    });

    if (expectedCalls > 0) {
      it("should instantiate Flagsmith with the correct environment", () => {
        expect(flagVendor.Client).toBeCalledWith(mockFlagEnvironment);
      });
    }
  };

  const actRequest = async () => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: factory.route,
      method,
      query: { username },
    }));
    factory.flag = requiredFlag;
    await factory.create()(req, res);
  };

  describe("with an authenticated user", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (getToken as jest.Mock).mockReturnValue(
        Promise.resolve({
          token: "testToken",
        })
      );
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
              expect(res._getStatusCode()).toBe(502);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(res._getStatusCode()).toBe(503);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
            });

            it("should return a 429", () => {
              expect(res._getStatusCode()).toBe(429);
              expect(res._getJSONData()).toStrictEqual(
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
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
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
              expect(res._getStatusCode()).toBe(503);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 502", () => {
              expect(res._getStatusCode()).toBe(502);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(res._getStatusCode()).toBe(503);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
            });

            it("should return a 429", () => {
              expect(res._getStatusCode()).toBe(429);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_429_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an not found proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 404;
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 503", () => {
              expect(res._getStatusCode()).toBe(503);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(0);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });
        });

        describe("with an disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an invalid proxy response", () => {
            beforeEach(async () => {
              factory = new ConcreteProxyErrorClass();
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(undefined);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an ratelimited proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 429;
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a request that generates an not found proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              (factory as ConcreteErrorClass).errorCode = 404;
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
          });

          describe("receives a TIMED OUT request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 404", () => {
              expect(res._getStatusCode()).toBe(404);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_404_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBe(undefined);
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 1 });
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
            mockIsFeatureEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 400", () => {
              expect(res._getStatusCode()).toBe(400);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
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
              expect(res._getStatusCode()).toBe(400);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 400", () => {
              expect(res._getStatusCode()).toBe(400);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_400_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
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
            expect(res._getStatusCode()).toBe(405);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
          });
        });
      });
    });
  });

  describe("with an UNAUTHENTICATED user", () => {
    beforeEach(() =>
      (getToken as jest.Mock).mockReturnValue(Promise.resolve(null))
    );

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
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
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

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request that generates any proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
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

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request that generates any proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteErrorClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
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

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            it("should NOT set a retry-after header", () => {
              expect(res.getHeader("retry-after")).toBeUndefined();
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
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
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 401", () => {
              expect(res._getStatusCode()).toBe(401);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_401_MESSAGE
              );
            });

            checkJWT();

            checkFeatureFlagLookup({ expectedCalls: 0 });
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
              expect(res._getStatusCode()).toBe(405);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with an enabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(true);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 405", () => {
              expect(res._getStatusCode()).toBe(405);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });

        describe("with a disabled flag", () => {
          beforeEach(async () => {
            requiredFlag = "mockFlag";
            mockIsFeatureEnabled.mockReturnValueOnce(false);
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteTimeoutClass();
              await actRequest();
            });

            it("should return a 405", () => {
              expect(res._getStatusCode()).toBe(405);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });

            checkFeatureFlagLookup({ expectedCalls: 0 });
          });
        });
      });
    });
  });
});
