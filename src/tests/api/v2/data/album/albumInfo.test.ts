import LastFMApiEndpointFactoryV2 from "../../../../../backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "../../../../../config/apiRoutes";
import {
  STATUS_400_MESSAGE,
  STATUS_503_MESSAGE,
} from "../../../../../config/status";
import handleProxy, {
  endpointFactory,
} from "../../../../../pages/api/v2/data/artists/[artist]/albums/[album]";
import {
  createAPIMocks,
  mockSession,
} from "../../../../fixtures/mock.authentication";
import type {
  MockAPIRequest,
  MockAPIResponse,
  QueryParamType,
} from "../../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";

jest.mock("../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAlbumInfo: mockProxyMethod,
    };
  });
});

jest.mock("../../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("../../../../../backend/integrations/auth/vendor", () => ({
  Client: jest.fn(() => ({
    getSession: mockGetSession,
  })),
}));

const mockGetSession = jest.fn();
const mockProxyMethod = jest.fn();
const endpointUnderTest = apiRoutes.v2.data.artists.albumsGet;

type ArrangeArgs = {
  query: QueryParamType;
  method: HttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  const mockResponse = { mock: "response" };
  const mockResponseWithUserPlayCount = { mock: "response", userplaycount: 0 };
  const mockResponseWithInvalidUserPlayCount = {
    mock: "response",
    userplaycount: { performing: "some query" },
  };
  let query: QueryParamType;
  let method: HttpMethodType;

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
    it("should inherit from LastFMApiEndpointFactoryV2", () => {
      expect(endpointFactory).toBeInstanceOf(LastFMApiEndpointFactoryV2);
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(endpointUnderTest);
    });

    it("should have the correct maxAgeValue set", () => {
      expect(endpointFactory.maxAgeValue).toBe(3600 * 24);
    });

    it("should have flag restrictions bypassed", () => {
      expect(endpointFactory.flag).toBe(null);
    });
  });

  describe("with a valid session", () => {
    beforeEach(() => mockGetSession.mockResolvedValue(mockSession));

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
              mockProxyMethod.mockReturnValueOnce(
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
                `max-age=${endpointFactory.maxAgeValue}`,
              ]);
            });

            it("should call the proxy method with the correct params", () => {
              expect(mockProxyMethod).toBeCalledWith(
                query.artist,
                query.album,
                query.username
              );
            });
          });

          describe("with a valid proxy response containing a valid userplaycount", () => {
            beforeEach(async () => {
              mockProxyMethod.mockReturnValueOnce(
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
                `max-age=${endpointFactory.maxAgeValue}`,
              ]);
            });

            it("should call the proxy method with the correct params", () => {
              expect(mockProxyMethod).toBeCalledWith(
                query.artist,
                query.album,
                query.username
              );
            });
          });

          describe("with a proxy response containing an invalid userplaycount", () => {
            beforeEach(async () => {
              mockProxyMethod.mockReturnValueOnce(
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
              expect(mockProxyMethod).toBeCalledWith(
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
            expect(mockProxyMethod).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});
