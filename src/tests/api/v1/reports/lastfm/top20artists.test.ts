import { mockLastFMProxyMethods } from "@src/backend/api/lastfm/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v1/reports/lastfm/top20artists";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type { MockAPIRequestType } from "@src/types/api/request.types";
import type { MockAPIResponseType } from "@src/types/api/response.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.mock("@src/backend/integrations/auth/vendor", () =>
  require("@fixtures/integrations/auth").authenticated()
);

jest.mock("@src/backend/integrations/api.logger/vendor");

jest.mock("@src/backend/api/lastfm/proxy/proxy.class");

const testUrl = apiRoutes.v1.reports.lastfm.top20artists;

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

describe(testUrl, () => {
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;
  const mockResponse = {
    artists: [],
    image: [],
  };
  let payload: Record<string, string>;
  let method: HttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: testUrl,
      method,
      body,
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("with a valid session", () => {
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
            mockLastFMProxyMethods.getUserTopArtists.mockReturnValueOnce(
              Promise.resolve(mockResponse)
            );
            await arrange({ body: payload, method });
          });

          it("should return a 200 status code", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should set a sunset header", () => {
            expect(mockRes._getHeaders().sunset).toBe(
              endpointFactory.sunsetDate.toDateString()
            );
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockLastFMProxyMethods.getUserTopArtists).toBeCalledWith(
              payload.userName
            );
          });
        });
      });
    });
  });
});
