import { LastFMApiEndpointFactory } from "@src/backend/api/exports";
import { mockLastFMProxyMethods } from "@src/backend/api/services/lastfm/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import { STATUS_400_MESSAGE, STATUS_503_MESSAGE } from "@src/config/status";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/data/artists/[artist]/albums/[album]";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type {
  MockAPIRequestType,
  ApiRequestQueryParamType,
} from "@src/backend/api/types/services/request.types";
import type { MockAPIResponseType } from "@src/backend/api/types/services/response.types";
import type { APIClientHttpMethodType } from "@src/contracts/api/exports.types";

jest.mock("@src/backend/api/integrations/auth/vendor", () =>
  require("@fixtures/api/auth").authenticated()
);

jest.mock("@src/backend/api/integrations/api.logger/vendor");

jest.mock("@src/backend/api/services/lastfm/proxy/proxy.class");

const endpointUnderTest = apiRoutes.v2.data.artists.albumsGet;

type ArrangeArgs = {
  query: ApiRequestQueryParamType;
  method: APIClientHttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;
  const mockResponse = { mock: "response" };
  const mockResponseWithUserPlayCount = { mock: "response", userplaycount: 0 };
  const mockResponseWithInvalidUserPlayCount = {
    mock: "response",
    userplaycount: { performing: "some query" },
  };
  let query: ApiRequestQueryParamType;
  let method: APIClientHttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ query, method = "GET" }: ArrangeArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: endpointUnderTest,
      method,
      query,
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("An instance of the endpoint factory class", () => {
    it("should inherit from LastFMApiEndpointFactory", () => {
      expect(endpointFactory).toBeInstanceOf(LastFMApiEndpointFactory);
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(endpointUnderTest);
    });

    it("should have the correct maxAgeValue set", () => {
      expect(endpointFactory.cacheMaxAgeValue).toBe(3600 * 24);
    });

    it("should have flag restrictions bypassed", () => {
      expect(endpointFactory.flag).toBe(null);
    });
  });

  describe("with a valid session", () => {
    describe("with valid data", () => {
      describe("receives a GET request", () => {
        beforeEach(() => {
          method = "GET" as const;
        });

        describe("with a valid payload", () => {
          beforeEach(async () => {
            query = {
              artist: "The%20Cure",
              album: "Wish",
              username: "niall-byrne",
            };
          });

          describe("with a valid proxy response containing no userplaycount", () => {
            beforeEach(async () => {
              mockLastFMProxyMethods.getAlbumInfo.mockReturnValueOnce(
                Promise.resolve(mockResponse)
              );
              await actRequest({ query, method });
            });

            it("should return a 200 status code", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getJSONData()).toStrictEqual(mockResponse);
            });

            it("should set a Cache-Control header", () => {
              expect(mockRes._getHeaders()["cache-control"]).toStrictEqual([
                "public",
                `max-age=${endpointFactory.cacheMaxAgeValue}`,
              ]);
            });

            it("should call the proxy method with the correct params", () => {
              expect(mockLastFMProxyMethods.getAlbumInfo).toBeCalledWith(
                query.artist,
                query.album,
                query.username
              );
            });
          });

          describe("with a valid proxy response containing a valid userplaycount", () => {
            beforeEach(async () => {
              mockLastFMProxyMethods.getAlbumInfo.mockReturnValueOnce(
                Promise.resolve(mockResponseWithUserPlayCount)
              );
              await actRequest({ query, method });
            });

            it("should return a 200 status code", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getJSONData()).toStrictEqual(
                mockResponseWithUserPlayCount
              );
            });

            it("should set a Cache-Control header", () => {
              expect(mockRes._getHeaders()["cache-control"]).toStrictEqual([
                "public",
                `max-age=${endpointFactory.cacheMaxAgeValue}`,
              ]);
            });

            it("should call the proxy method with the correct params", () => {
              expect(mockLastFMProxyMethods.getAlbumInfo).toBeCalledWith(
                query.artist,
                query.album,
                query.username
              );
            });
          });

          describe("with a proxy response containing an invalid userplaycount", () => {
            beforeEach(async () => {
              mockLastFMProxyMethods.getAlbumInfo.mockReturnValueOnce(
                Promise.resolve(mockResponseWithInvalidUserPlayCount)
              );
              await actRequest({ query, method });
            });

            it("should return a 503 status code", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(STATUS_503_MESSAGE);
            });

            it("should NOT set a Cache-Control header", () => {
              expect(mockRes._getHeaders()["cache-control"]).toBeUndefined();
            });

            it("should set a Retry-After header", () => {
              expect(mockRes._getHeaders()["retry-after"]).toStrictEqual(0);
            });

            it("should call the proxy method with the correct params", () => {
              expect(mockLastFMProxyMethods.getAlbumInfo).toBeCalledWith(
                query.artist,
                query.album,
                query.username
              );
            });
          });
        });

        describe("with an invalid payload", () => {
          beforeEach(async () => {
            query = {};
            await actRequest({ query, method });
          });

          it("should return a 400 status code", () => {
            expect(mockRes._getStatusCode()).toBe(400);
            expect(mockRes._getJSONData()).toStrictEqual(STATUS_400_MESSAGE);
          });

          it("should NOT call the proxy method", () => {
            expect(mockLastFMProxyMethods.getAlbumInfo).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});
