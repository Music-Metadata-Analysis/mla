import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import * as status from "../../../../config/status";
import { ProxyError } from "../../../../errors/proxy.error.class";
import LastFMApiEndpointFactoryV1 from "../v1.endpoint.base.class";
import type { BodyType } from "../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

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

jest.mock("../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

describe("LastFMApiEndpointFactoryV1", () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
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
    it("should call getToken with the correct props", () => {
      expect(getToken).toBeCalledTimes(1);
      const call = (getToken as jest.Mock).mock.calls[0][0];
      expect(call.req).toBe(req);
      expect(call.secret).toBe(mockJWTSecret);
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const arrange = async () => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: factory.route,
      method,
      body: payload,
    }));
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
            expect(res._getStatusCode()).toBe(502);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
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
            expect(res._getStatusCode()).toBe(429);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_429_MESSAGE);
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
            expect(res._getStatusCode()).toBe(404);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_404_MESSAGE);
          });

          checkJWT();
        });

        describe("receives a TIMED OUT request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 503", () => {
            expect(res._getStatusCode()).toBe(503);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_503_MESSAGE);
          });

          it("should set a retry-after header", () => {
            expect(res.getHeader("retry-after")).toBe(0);
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
            expect(res._getStatusCode()).toBe(400);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
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
            expect(res._getStatusCode()).toBe(400);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
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
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
          });

          checkJWT();
        });

        describe("receives a TIMED OUT request", () => {
          beforeEach(async () => {
            factory = new ConcreteTimeoutClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
          });

          it("should NOT set a retry-after header", () => {
            expect(res.getHeader("retry-after")).toBeUndefined();
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
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
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
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
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
            expect(res._getStatusCode()).toBe(405);
            expect(res._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
          });
        });
      });
    });
  });
});
