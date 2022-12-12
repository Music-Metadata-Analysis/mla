import { waitFor } from "@testing-library/react";
import ConcreteV1EndpointProxyErrorClass from "./implementations/concrete.v1.proxy.error.class";
import ConcreteV1EndpointTimeoutErrorClass from "./implementations/concrete.v1.timout.error.class";
import { mockEndpointLogger } from "@src/backend/integrations/api.logger/__mocks__/vendor.mock";
import { mockAuthClient } from "@src/backend/integrations/auth/__mocks__/vendor.mock";
import authVendor from "@src/backend/integrations/auth/vendor";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type LastFMApiEndpointFactoryV1 from "../v1.endpoint.base.class";
import type { MockAPIRequestType } from "@src/types/api/request.types";
import type { MockAPIResponseType } from "@src/types/api/response.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.mock("@src/backend/integrations/auth/vendor");

jest.mock("@src/backend/integrations/api.logger/vendor");

describe("LastFMApiEndpointFactoryV1", () => {
  let clearTimeOut: jest.SpyInstance;

  let factoryInstance: LastFMApiEndpointFactoryV1 & { errorCode?: number };

  let method: HttpMethodType;
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;

  let payload: undefined | Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOut = jest.spyOn(window, "clearTimeout");
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

  const checkNoJWT = () => {
    it("should NOT instantiate the authentication client", () => {
      expect(authVendor.Client).toBeCalledTimes(0);
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

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: factoryInstance.route,
      method,
      body: payload,
    }));
    await factoryInstance.createHandler()(mockReq, mockRes);
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
            factoryInstance = new ConcreteV1EndpointProxyErrorClass();
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
              factoryInstance = new ConcreteV1EndpointProxyErrorClass();
              factoryInstance.errorCode = errorCode;
              await arrange();
            });

            it(`should return a ${errorCode}`, () => {
              expect(mockRes._getStatusCode()).toBe(errorCode);
              expect(mockRes._getJSONData()).toStrictEqual(statusMessage);
            });

            checkJWT();
            checkNoRetryHeader();
            checkTimeoutCleared();
            checkLogger();
          }
        );

        describe("receives a request that times out", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 503", () => {
            expect(mockRes._getStatusCode()).toBe(503);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_503_MESSAGE
            );
          });

          checkJWT();
          checkRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
        });
      });

      describe("with an invalid payload", () => {
        beforeEach(() => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
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
          checkLogger();
        });
      });

      describe("with no data", () => {
        beforeEach(async () => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 400", () => {
            expect(mockRes._getStatusCode()).toBe(400);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_400_MESSAGE
            );
          });

          checkJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
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
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });

          checkNoJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
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

        describe("receives a request that generates an unknown proxy error", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointProxyErrorClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
        });

        describe("receives a TIMED OUT request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
        });
      });

      describe("with an invalid payload", () => {
        beforeEach(() => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
        });
      });

      describe("with no data", () => {
        beforeEach(async () => {
          payload = { incorrectField: "validUser" };
        });

        describe("receives a request", () => {
          beforeEach(async () => {
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 401", () => {
            expect(mockRes._getStatusCode()).toBe(401);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_401_MESSAGE
            );
          });

          checkJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
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
            factoryInstance = new ConcreteV1EndpointTimeoutErrorClass();
            await arrange();
          });

          it("should return a 405", () => {
            expect(mockRes._getStatusCode()).toBe(405);
            expect(mockRes._getJSONData()).toStrictEqual(
              status.STATUS_405_MESSAGE
            );
          });

          checkNoJWT();
          checkNoRetryHeader();
          checkTimeoutNotCleared();
          checkLogger();
        });
      });
    });
  });
});
