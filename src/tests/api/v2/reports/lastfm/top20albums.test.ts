import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import LastFMApiEndpointFactoryV2 from "../../../../../backend/api/lastfm/v2.endpoint.base.class";
import apiRoutes from "../../../../../config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "../../../../../pages/api/v2/reports/lastfm/top20albums/[username]";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserTopAlbums: mockProxyMethod,
    };
  });
});

jest.mock("../../../../../backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockProxyMethod = jest.fn();
const testUrl = apiRoutes.v2.reports.lastfm.top20albums;

type RequestArgs = {
  username: string;
  method: HttpMethodType;
};

describe(testUrl, () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  const mockResponse = {
    albums: [],
    image: [],
  };
  let username: string;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ username, method = "GET" }: RequestArgs) => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: testUrl,
      method,
      query: { username },
    }));
    await handleProxy(req, res);
  };

  describe("An instance of the endpoint factory class", () => {
    it("should inherit from LastFMApiEndpointFactoryV2", () => {
      expect(endpointFactory).toBeInstanceOf(LastFMApiEndpointFactoryV2);
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(testUrl);
    });

    it("should have the correct maxAgeValue set", () => {
      expect(endpointFactory.maxAgeValue).toBe(3600 * 24);
    });

    it("should have flag restrictions bypassed", () => {
      expect(endpointFactory.flag).toBe(null);
    });
  });

  describe("with a valid jwt token", () => {
    beforeEach(() =>
      (getToken as jest.Mock).mockReturnValue(
        Promise.resolve({
          token: "testToken",
        })
      )
    );

    describe("with valid data", () => {
      beforeEach(() => {
        username = "test_user";
      });

      describe("receives a GET request", () => {
        beforeEach(() => {
          method = "GET" as const;
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            mockProxyMethod.mockReturnValueOnce(Promise.resolve(mockResponse));
            await actRequest({ username, method });
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
            expect(mockProxyMethod).toBeCalledWith(username);
          });
        });
      });
    });
  });
});
