import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import apiRoutes from "../../../../../config/apiRoutes";
import handleProxy from "../../../../../pages/api/v1/reports/lastfm/top20tracks";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopTracks: mockProxyMethod,
    };
  });
});

jest.mock("../../../../../backend/api/lastfm/endpoint.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockProxyMethod = jest.fn();

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

describe(apiRoutes.v1.reports.lastfm.top20tracks, () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  const mockResponse = {
    tracks: [],
    image: [],
  };
  let payload: Record<string, string>;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: apiRoutes.v1.reports.lastfm.top20tracks,
      method,
      body,
    }));
    await handleProxy(req, res);
  };

  describe("with a valid jwt token", () => {
    beforeEach(() =>
      (getToken as jest.Mock).mockReturnValue(
        Promise.resolve({
          token: "testToken",
        })
      )
    );

    describe("receives a POST request", () => {
      beforeEach(() => {
        method = "POST" as const;
      });

      describe("with valid data", () => {
        beforeEach(async () => {
          payload = { userName: "valid" };
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            mockProxyMethod.mockReturnValueOnce(Promise.resolve(mockResponse));
            await arrange({ body: payload, method });
          });

          it("should return a 200 status code", () => {
            expect(res._getStatusCode()).toBe(200);
            expect(res._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockProxyMethod).toBeCalledWith(payload.userName);
          });
        });
      });
    });
  });
});
