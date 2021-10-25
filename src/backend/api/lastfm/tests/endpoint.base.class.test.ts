import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import * as status from "../../../../config/status";
import { ProxyError } from "../../../../errors/proxy.error.class";
import BaseClass from "../endpoint.base.class";
import type { HttpMethodType } from "../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

class ConcreteTimeoutClass extends BaseClass {
  route = "/api/v1/endpoint";
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

class ConcreteErrorClass extends BaseClass {
  route = "/api/v1/endpoint";
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProxyResponse(_: string) {
    throw new ProxyError(this.mockError, this.errorCode);
  }
}

jest.mock("../../../../backend/api/lastfm/endpoint.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

describe("EndpointBaseClass", () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  let payload: undefined | Record<string, string>;
  let factory: BaseClass | ConcreteTimeoutClass | ConcreteErrorClass;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async () => {
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
