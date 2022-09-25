import LastFMApiEndpointFactoryV1 from "../v1.endpoint.base.class";
import authVendor from "@src/backend/integrations/auth/vendor";
import * as status from "@src/config/status";
import { ProxyError } from "@src/errors/proxy.error.class";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type {
  BodyType,
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

class ConcreteTimeoutClass extends LastFMApiEndpointFactoryV1 {
  route = "/api/v1/endpoint";
  timeOut = 100;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: BodyType) {
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

class ConcreteErrorClass extends LastFMApiEndpointFactoryV1 {
  route = "/api/v1/endpoint";
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: BodyType) {
    throw new ProxyError(this.mockError, this.errorCode);
    return {
      error: "error",
    };
  }
}

jest.mock("@src/backend/integrations/auth/vendor", () => ({
  Client: jest.fn(() => ({
    getSession: mockGetSession,
  })),
}));

jest.mock("@src/backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

const mockGetSession = jest.fn();

describe("LastFMApiEndpointFactoryV1", () => {
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  let payload: undefined | Record<string, string>;
  let factory:
    | LastFMApiEndpointFactoryV1
    | ConcreteTimeoutClass
    | ConcreteErrorClass;
  let originalEnvironment: typeof process.env;
  let method: HttpMethodType;
  const mockJWTSecret = "MockValue1";

  const setupEnv = () => {
    process.env.AUTH_MASTER_JWT_SECRET = mockJWTSecret;
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
    it("should instantiate the authentication client as expected", () => {
      expect(authVendor.Client).toBeCalledTimes(1);
      expect(authVendor.Client).toBeCalledWith(mockReq);
    });

    it("should call the getSession method with the correct props", () => {
      expect(mockGetSession).toBeCalledTimes(1);
      expect(mockGetSession).toBeCalledWith();
    });
  };

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factory.route,
      method,
      body: payload,
    }));
    await factory.create()(mockReq, mockRes);
  };

  describe("with an authenticated user", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue(mockSession);
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid payload", () => {
        beforeEach(() => {
          payload = { userName: "validUser" };
        });

        describe("receives a request that generates an unknown proxy error", () => {
          beforeEach(async () => {
            factory = new ConcreteErrorClass();
            await arrange();
          });

          it("should return a 502", () => {
            expect(mockRes._getStatusCode()).toBe(502);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_502_MESSAGE
            );
          });

          checkJWT();
        });

        describe("receives a request that generates an ratelimited proxy error", () => {
          beforeEach(async () => {
            factory = new ConcreteErrorClass();
            (factory as ConcreteErrorClass).errorCode = 429;
            await arrange();
          });

          it("should return a 429", () => {
            expect(mockRes._getStatusCode()).toBe(429);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_429_MESSAGE
            );
          });

          checkJWT();
        });

        describe("receives a request that generates an not found proxy error", () => {
          beforeEach(async () => {
            factory = new ConcreteErrorClass();
            (factory as ConcreteErrorClass).errorCode = 404;
            await arrange();
          });

          it("should return a 404", () => {
            expect(mockRes._getStatusCode()).toBe(404);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_404_MESSAGE
            );
          });

          checkJWT();
        });

        describe("receives a TIMED OUT request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
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
        });
      });

      describe("with an invalid payload", () => {
        beforeEach(() => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 400", () => {
            expect(mockRes._getStatusCode()).toBe(400);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_400_MESSAGE
            );
          });

          checkJWT();
        });
      });

      describe("with no data", () => {
        beforeEach(async () => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 400", () => {
            expect(mockRes._getStatusCode()).toBe(400);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_400_MESSAGE
            );
          });

          checkJWT();
        });
      });
    });

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with no payload", () => {
        beforeEach(async () => {
          payload = undefined;
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
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
    beforeEach(() => {
      mockGetSession.mockResolvedValue(null);
    });

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid payload", () => {
        beforeEach(() => {
          payload = { userName: "validUser" };
        });

        describe("receives a request that generates any proxy error", () => {
          beforeEach(async () => {
            factory = new ConcreteErrorClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
        });

        describe("receives a TIMED OUT request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
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
        });
      });

      describe("with an invalid payload", () => {
        beforeEach(() => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
        });
      });

      describe("with no data", () => {
        beforeEach(async () => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
        });
      });
    });

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with no payload", () => {
        beforeEach(async () => {
          payload = undefined;
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
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
});
