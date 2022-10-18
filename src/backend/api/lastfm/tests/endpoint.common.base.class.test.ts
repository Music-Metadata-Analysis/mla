import { waitFor } from "@testing-library/react";
import nextConnect, { NextHandler } from "next-connect";
import LastFMEndpointBase from "../endpoint.common.base.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type {
  BodyType,
  LastFMEndpointRequest,
  LastFMEndpointResponse,
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

class ConcreteClass extends LastFMEndpointBase {
  route = "/api/v1/endpoint";
  timeOut = 100;

  create() {
    const handler = nextConnect<LastFMEndpointRequest, LastFMEndpointResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.get(this.route, async (req, res, next) => {
      const error = req.query.error as string;
      const response = await this.getProxyResponse({ error });
      res.status(200).json(response);
      next();
    });
    handler.use(mockExpressMiddleware);
    return handler;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProxyResponse(param: BodyType) {
    if (param.error) throw new Error("Unknown Proxy Error");
    return { ok: true };
  }
}

const mockExpressMiddleware = (
  req: LastFMEndpointRequest,
  res: LastFMEndpointResponse,
  next: NextHandler
) => next();

describe("LastFMEndpointBase", () => {
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  let payload: undefined | Record<string, string>;
  let factory: ConcreteClass;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("with a concrete implementation", () => {
    let mockTimeout: jest.Mock;

    beforeEach(async () => {
      factory = new ConcreteClass();
    });

    const arrangeMocks = async (url = factory.route) => {
      ({ req: mockReq, res: mockRes } = createAPIMocks({
        url,
        method,
        body: payload,
      }));
    };

    const arrangeRequest = async (url = factory.route) => {
      arrangeMocks(url);
      await factory.create()(mockReq, mockRes);
    };

    describe("createTimeout", () => {
      beforeEach(async () => {
        mockTimeout = jest.fn();
        arrangeMocks();
        factory.createTimeout(mockReq, mockRes, mockTimeout);
      });

      it("should attach a timeout instance on the request", () => {
        expect(
          (mockReq as LastFMEndpointRequest).proxyTimeoutInstance
        ).toBeDefined();
      });

      describe("when the timeout fires", () => {
        beforeEach(async () => {
          await waitFor(() => expect(mockRes._getStatusCode()).toBe(503));
        });

        it("should modify the response status code to 503", async () => {
          expect(mockRes._getJSONData()).toStrictEqual(
            status.STATUS_503_MESSAGE
          );
        });

        it("should modify the response to set a retry header", async () => {
          await waitFor(() =>
            expect(mockRes._getHeaders()).toStrictEqual({
              "content-type": "application/json",
              "retry-after": 0,
            })
          );
        });

        it("should clear the timeout instance on the request", () => {
          expect(
            (mockReq as LastFMEndpointRequest).proxyTimeoutInstance
          ).toBeUndefined();
        });
      });
    });

    describe("clearTimeout", () => {
      let clearTimeOut: jest.SpyInstance;

      describe("with a timeout created", () => {
        beforeEach(async () => {
          mockTimeout = jest.fn();
          clearTimeOut = jest.spyOn(window, "clearTimeout");
          arrangeMocks();
          factory.createTimeout(mockReq, mockRes, mockTimeout);
        });

        afterEach(() => clearTimeOut.mockRestore());

        describe("when called", () => {
          beforeEach(async () => {
            factory.clearTimeout(mockReq);
          });

          it("should clear the timeout", async () => {
            await waitFor(() => expect(clearTimeOut).toBeCalledTimes(1));
          });

          it("should clear the timeout instance on the request", () => {
            expect(
              (mockReq as LastFMEndpointRequest).proxyTimeoutInstance
            ).toBeUndefined();
          });
        });
      });

      describe("with NO timeout created", () => {
        describe("when called", () => {
          it("should clear the timeout", async () => {
            await waitFor(() => expect(clearTimeOut).toBeCalledTimes(0));
          });
        });
      });
    });

    describe("create", () => {
      describe("generates a handler that", () => {
        describe("with a GET request", () => {
          beforeEach(() => {
            method = "GET" as const;
          });

          describe("receives a regular request", () => {
            beforeEach(async () => {
              factory = new ConcreteClass();
              await arrangeRequest();
            });

            it("should return a 200", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getJSONData()).toStrictEqual({ ok: true });
            });
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteClass();
              await arrangeRequest(factory.route + "?error=true");
            });

            it("should return a 502", () => {
              expect(mockRes._getStatusCode()).toBe(502);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_502_MESSAGE
              );
            });
          });
        });

        describe("with a POST request", () => {
          beforeEach(() => {
            method = "POST" as const;
          });

          describe("receives a request", () => {
            beforeEach(async () => {
              factory = new ConcreteClass();
              await arrangeRequest();
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
});
