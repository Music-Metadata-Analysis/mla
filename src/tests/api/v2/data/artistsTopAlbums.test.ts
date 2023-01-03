import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import { mockLastFMProxyMethods } from "@src/backend/api/services/lastfm/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import { STATUS_400_MESSAGE } from "@src/config/status";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/data/artists/[artist]/albums/index";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type {
  MockAPIRequestType,
  ApiRequestQueryParamType,
} from "@src/types/api/request.types";
import type { MockAPIResponseType } from "@src/types/api/response.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.mock("@src/backend/integrations/auth/vendor", () =>
  require("@fixtures/integrations/auth").authenticated()
);

jest.mock("@src/backend/integrations/api.logger/vendor");

jest.mock("@src/backend/api/services/lastfm/proxy/proxy.class");

const endpointUnderTest = apiRoutes.v2.data.artists.albumsList;

type ArrangeArgs = {
  query: ApiRequestQueryParamType;
  method: HttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;
  const mockResponse = { mock: "response" };
  let query: ApiRequestQueryParamType;
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

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            query = { artist: "The%20Cure" };
            mockLastFMProxyMethods.getArtistTopAlbums.mockReturnValueOnce(
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
            expect(mockLastFMProxyMethods.getArtistTopAlbums).toBeCalledWith(
              query.artist
            );
          });
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
        expect(mockLastFMProxyMethods.getArtistTopAlbums).toBeCalledTimes(0);
      });
    });
  });
});
