import { getToken } from "next-auth/jwt";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import apiRoutes from "../../../../../config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "../../../../../pages/api/v2/reports/lastfm/top20artists/[...username]";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopArtists: mockProxyMethod,
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
const testUrl = apiRoutes.v2.reports.lastfm.top20artists;

type ArrangeArgs = {
  username: string;
  method: HttpMethodType;
};

describe(testUrl, () => {
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
  const mockResponse = {
    artists: [],
    image: [],
  };
  let username: string;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ username, method = "GET" }: ArrangeArgs) => {
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: testUrl,
      method,
      query: { username: [username] },
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

    describe("receives a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with valid data", () => {
        beforeEach(async () => {
          username = "test_user";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            mockProxyMethod.mockReturnValueOnce(Promise.resolve(mockResponse));
            await arrange({ username, method });
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
