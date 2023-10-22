import ReportCacheRetrieveEndpointFactoryV2 from "@src/api/services/report.cache/endpoints/v2.report.cache.retrieve.endpoint.factory.class";
import { mockReportCacheProxyMethods } from "@src/api/services/report.cache/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import mockReportState from "@src/contracts/api/services/lastfm/fixtures/aggregates/playcount.by.artist/lastfm.report.state.playcount.by.artist.sunburst.complete.1.json";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/cache/[source]/[report]";
import {
  createAPIMocks,
  mockSession,
} from "@src/vendors/integrations/api.framework/fixtures";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

jest.mock("@src/vendors/integrations/auth/vendor.backend", () =>
  require("@src/vendors/integrations/auth/__mocks__/vendor.backend.mock").authenticated()
);

jest.mock("@src/api/services/report.cache/proxy/proxy.class");

const endpointUnderTest = apiRoutes.v2.cache.retrieve;

type RequestArgs = {
  method: HttpApiClientHttpMethodType;
};

describe(endpointUnderTest, () => {
  let method: HttpApiClientHttpMethodType;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  let mockUserName: string;

  const mockRetrieveResponse = {
    response: { mock: "report" },
    cacheControl: "max-age=26",
  };

  const mockReportName = "playcountbyartist";
  const mockSourceName = "lastfm";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ method = "POST" }: RequestArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: endpointUnderTest,
      method,
      query: {
        report: mockReportName,
        source: mockSourceName,
        username: mockUserName,
      },
      body: mockReportState,
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("an instance of the endpoint factory class", () => {
    it("should be an instance of ReportCacheRetrieveEndpointFactoryV2", () => {
      expect(endpointFactory).toBeInstanceOf(
        ReportCacheRetrieveEndpointFactoryV2
      );
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(endpointUnderTest);
    });

    it("should have the correct service set", () => {
      expect(endpointFactory.service).toBe("CloudFront");
    });
  });

  describe("with a valid session", () => {
    describe("with valid data", () => {
      beforeEach(() => {
        mockUserName = "test_user";
      });

      describe("receives a GET request", () => {
        beforeEach(() => {
          method = "GET" as const;
        });

        describe("with a valid proxy response", () => {
          beforeEach(async () => {
            jest
              .mocked(mockReportCacheProxyMethods.retrieveCacheObject)
              .mockReturnValueOnce(Promise.resolve(mockRetrieveResponse));
            await actRequest({ method });
          });

          it("should return a 200 status code", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(
              mockRetrieveResponse.response
            );
          });

          it("should set the correct Cache-Control header", () => {
            expect(mockRes._getHeaders()["cache-control"]).toStrictEqual(
              mockRetrieveResponse.cacheControl
            );
          });

          it("should call the proxy method with the correct params", () => {
            expect(
              mockReportCacheProxyMethods.retrieveCacheObject
            ).toBeCalledWith({
              authenticatedUserName: mockSession?.email,
              reportName: "playcountbyartist",
              sourceName: "lastfm",
              userName: "test_user",
            });
          });
        });
      });
    });
  });
});
