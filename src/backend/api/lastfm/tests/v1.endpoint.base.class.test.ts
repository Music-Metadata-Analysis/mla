import { waitFor } from "@testing-library/react";
import LastFMApiEndpointFactoryV1 from "../v1.endpoint.base.class";
import { mockAuthClient } from "@src/backend/integrations/auth/__mocks__/vendor.mock";
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
    return [];
  }
}

class ConcreteErrorClass extends LastFMApiEndpointFactoryV1 {
  route = "/api/v1/endpoint";
  mockError = "mockError";
  errorCode?: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(_: BodyType) {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}

jest.mock("@src/backend/integrations/auth/vendor");

jest.mock("@src/backend/api/lastfm/endpoint.common.logger");

describe("LastFMApiEndpointFactoryV1", () => {
  let clearTimeOut: jest.SpyInstance;
  let factory:
    | LastFMApiEndpointFactoryV1
    | ConcreteTimeoutClass
    | ConcreteErrorClass;
  let originalEnvironment: typeof process.env;
  let payload: undefined | Record<string, string>;
  let method: HttpMethodType;
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;

  const mockJWTSecret = "MockValue1";

  const setupEnv = () => {
    process.env.AUTH_MASTER_JWT_SECRET = mockJWTSecret;
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
      mockAuthClient.getSession.mockResolvedValue(mockSession);
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

          checkTimeoutCleared();
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

          checkTimeoutCleared();
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

          checkTimeoutCleared();
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

          checkTimeoutNotCleared();
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

          checkTimeoutNotCleared();
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

          checkTimeoutNotCleared();
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
      mockAuthClient.getSession.mockResolvedValue(null);
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

          checkTimeoutNotCleared();
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

          checkTimeoutNotCleared();
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

          checkTimeoutNotCleared();
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

          checkTimeoutNotCleared();
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
