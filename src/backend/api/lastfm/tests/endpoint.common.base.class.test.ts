import { waitFor } from "@testing-library/react";
import nextConnect, { NextHandler } from "next-connect";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import * as status from "../../../../config/status";
import LastFMEndpointBase from "../endpoint.common.base.class";
import type { BodyType } from "../../../../types/api.endpoint.types";
import type { LastFMEndpointRequest } from "../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

class ConcreteClass extends LastFMEndpointBase {
  route = "/api/v1/endpoint";
  timeOut = 100;

  create() {
    const handler = nextConnect<LastFMEndpointRequest, NextApiResponse>({
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
  res: NextApiResponse,
  next: NextHandler
) => next();

describe("LastFMEndpointBase", () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
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
      // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
      ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
        url,
        method,
        body: payload,
      }));
    };

    const arrangeRequest = async (url = factory.route) => {
      // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
      ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
        url,
        method,
        body: payload,
      }));
      await factory.create()(req, res);
    };

    describe("createTimeout", () => {
      beforeEach(async () => {
        mockTimeout = jest.fn();
        arrangeMocks();
        factory.createTimeout(req, res, mockTimeout);
      });

      describe("when called", () => {
        it("should modify the response status code to 503", async () => {
          await waitFor(() => expect(res._getStatusCode()).toBe(503));
          expect(res._getJSONData()).toStrictEqual(status.STATUS_503_MESSAGE);
        });

        it("should modify the response to set a retry header", async () => {
          await waitFor(() =>
            expect(res._getHeaders()).toStrictEqual({
              "content-type": "application/json",
              "retry-after": 0,
            })
          );
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
          factory.createTimeout(req, res, mockTimeout);
        });

        afterEach(() => clearTimeOut.mockRestore());

        describe("when called", () => {
          beforeEach(async () => {
            factory.clearTimeout();
          });

          it("should clear the timeout", async () => {
            await waitFor(() => expect(clearTimeOut).toBeCalledTimes(1));
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
              expect(res._getStatusCode()).toBe(200);
              expect(res._getJSONData()).toStrictEqual({ ok: true });
            });
          });

          describe("receives a request that generates an unknown proxy error", () => {
            beforeEach(async () => {
              factory = new ConcreteClass();
              await arrangeRequest(factory.route + "?error=true");
            });

            it("should return a 502", () => {
              expect(res._getStatusCode()).toBe(502);
              expect(res._getJSONData()).toStrictEqual(
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
              expect(res._getStatusCode()).toBe(405);
              expect(res._getJSONData()).toStrictEqual(
                status.STATUS_405_MESSAGE
              );
            });
          });
        });
      });
    });
  });
});
