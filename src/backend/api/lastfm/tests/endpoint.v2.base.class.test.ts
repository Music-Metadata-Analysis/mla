import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import * as status from "../../../../config/status";
import { ProxyError } from "../../../../errors/proxy.error.class";
import LastFMApiEndpointFactoryV2 from "../endpoint.v2.base.class";
import type { HttpMethodType } from "../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

class ConcreteTimeoutClass extends LastFMApiEndpointFactoryV2 {
  route = "/api/v2/endpoint/:username";
  timeOut = 100;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProxyResponse(_: string) {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    return sleep(this.timeOut * 2);
  }
}

class ConcreteErrorClass extends LastFMApiEndpointFactoryV2 {
  route = "/api/v2/endpoint/:username";
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProxyResponse(_: string) {
    throw new ProxyError(this.mockError, this.errorCode);
  }
}

jest.mock("../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

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
  let username: [string] | null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const checkJWT = () => {
    it("should call getToken with the correct props", () => {
      expect(getToken).toBeCalledTimes(1);
      const call = (getToken as jest.Mock).mock.calls[0][0];
      expect(call.req).toBe(req);
      expect(call.secret).toBe(process.env.AUTH_MASTER_JWT_SECRET);
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const arrange = async () => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: factory.route,
      method,
      query: { username },
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

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUser"];
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

      describe("with an invalid username", () => {
        beforeEach(() => {
          username = null;
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

    describe("with a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with a valid username", () => {
        beforeEach(() => {
          username = ["validUser"];
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

      describe("with an invalid username", () => {
        beforeEach(() => {
          username = null;
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

    describe("with a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with a valid username", () => {
        beforeEach(async () => {
          username = ["validUser"];
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
