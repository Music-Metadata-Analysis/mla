import LastFMApiEndpointFactoryV2 from "@src/backend/api/services/lastfm/endpoints/v2.endpoint.base.class";
import { mockLastFMProxyMethods } from "@src/backend/api/services/lastfm/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import { STATUS_400_MESSAGE } from "@src/config/status";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/data/artists/[artist]/albums/[album]/tracks/[track]";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type { ApiEndpointRequestQueryParamType } from "@src/backend/api/types/services/request.types";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/exports/types/client";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/backend/api/services/lastfm/proxy/proxy.class");

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

jest.mock("@src/vendors/integrations/auth/vendor.backend", () =>
  require("@src/vendors/integrations/auth/__mocks__/vendor.backend.mock").authenticated()
);

const endpointUnderTest = apiRoutes.v2.data.artists.tracksGet;

type ArrangeArgs = {
  query: ApiEndpointRequestQueryParamType;
  method: HttpApiClientHttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  const mockResponse = { mock: "response" };
  let query: ApiEndpointRequestQueryParamType;
  let method: HttpApiClientHttpMethodType;

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

        describe("with a valid payload", () => {
          beforeEach(async () => {
            query = {
              artist: "The%20Cure",
              track: "Open",
              username: "niall-byrne",
            };
            mockLastFMProxyMethods.getTrackInfo.mockReturnValueOnce(
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
            expect(mockLastFMProxyMethods.getTrackInfo).toBeCalledWith(
              query.artist,
              query.track,
              query.username
            );
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
            expect(mockLastFMProxyMethods.getTrackInfo).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});
