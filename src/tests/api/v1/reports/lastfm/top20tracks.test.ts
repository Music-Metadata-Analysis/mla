import apiRoutes from "../../../../../config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "../../../../../pages/api/v1/reports/lastfm/top20tracks";
import {
  createAPIMocks,
  mockSession,
} from "../../../../fixtures/mock.authentication";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "../../../../../types/api.endpoint.types";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";

jest.mock("../../../../../backend/integrations/lastfm/proxy.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserTopTracks: mockProxyMethod,
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
const testUrl = apiRoutes.v1.reports.lastfm.top20tracks;

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

describe(testUrl, () => {
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
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
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: testUrl,
      method,
      body,
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("with a valid session", () => {
    beforeEach(() => mockGetSession.mockResolvedValue(mockSession));

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
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should set a sunset header", () => {
            expect(mockRes._getHeaders().sunset).toBe(
              endpointFactory.sunsetDate.toDateString()
            );
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockProxyMethod).toBeCalledWith(payload.userName);
          });
        });
      });
    });
  });
});
