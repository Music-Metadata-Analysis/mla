import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import apiRoutes from "../../../../../../config/apiRoutes";
import { STATUS_400_MESSAGE } from "../../../../../../config/status";
import handleProxy, {
  endpointFactory,
} from "../../../../../../pages/api/v2/data/artists/[artist]/albums/[album]/tracks/[track]";
import type { QueryParamType } from "../../../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTrackInfo: mockProxyMethod,
    };
  });
});

jest.mock("../../../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockProxyMethod = jest.fn();
const testUrl = apiRoutes.v2.data.artists.tracksGet;

type ArrangeArgs = {
  query: QueryParamType;
  method: HttpMethodType;
};

describe(testUrl, () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  const mockResponse = { mock: "response" };
  let query: QueryParamType;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ query, method = "GET" }: ArrangeArgs) => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: testUrl,
      method,
      query,
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

    describe("with valid data", () => {
      describe("receives a GET request", () => {
        beforeEach(() => {
          method = "GET" as const;
        });

        describe("with a valid payload", () => {
          beforeEach(async () => {
            query = {
              artist: "The%20Cure",
              track: "Open",
              username: "niall-byrne",
            };
            mockProxyMethod.mockReturnValueOnce(Promise.resolve(mockResponse));
            await arrange({ query, method });
          });

          it("should return a 200 status code", () => {
            expect(res._getStatusCode()).toBe(200);
            expect(res._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should set a Cache-Control header", () => {
            expect(res._getHeaders()["cache-control"]).toStrictEqual([
              "public",
              `max-age=${endpointFactory.maxAgeValue}`,
            ]);
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockProxyMethod).toBeCalledWith(
              query.artist,
              query.track,
              query.username
            );
          });
        });
      });

      describe("with an invalid payload", () => {
        beforeEach(async () => {
          query = {};
          await arrange({ query, method });
        });

        it("should return a 400 status code", () => {
          expect(res._getStatusCode()).toBe(400);
          expect(res._getJSONData()).toStrictEqual(STATUS_400_MESSAGE);
        });

        it("should NOT call the proxy method", () => {
          expect(mockProxyMethod).toBeCalledTimes(0);
        });
      });
    });
  });
});
