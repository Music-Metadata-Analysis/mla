import apiRoutes from "@src/config/apiRoutes";
import { STATUS_400_MESSAGE, STATUS_405_MESSAGE } from "@src/config/status";
import handleProxy from "@src/pages/api/auth/redirect/callback/lastfm";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

const endpointUnderTest = apiRoutes.auth.redirect.callback.lastfm;

type RequestArgs = {
  method: HttpApiClientHttpMethodType;
  token: string | undefined;
};

describe(endpointUnderTest, () => {
  let method: HttpApiClientHttpMethodType;
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  let originalEnvironment: typeof process.env;

  const mockToken = "mockToken";
  const mockNextAuthUrl = "https://mock:3000";

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.NEXTAUTH_URL = mockNextAuthUrl;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ method, token }: RequestArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: endpointUnderTest,
      method,
      query: {
        token,
      },
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("receives a GET request", () => {
    let expectedUrl: URL;

    beforeEach(() => (method = "GET"));

    describe("with a valid token", () => {
      beforeEach(async () => {
        expectedUrl = new URL(mockNextAuthUrl + "/api/auth/callback/lastfm");
        expectedUrl.searchParams.append("id_token", mockToken);

        await actRequest({ method, token: mockToken });
      });

      it("should redirect as expected", () => {
        expect(mockRes._getStatusCode()).toBe(302);
        expect(mockRes._getRedirectUrl()).toStrictEqual(expectedUrl.toString());
      });
    });

    describe("with an invalid token", () => {
      beforeEach(async () => {
        expectedUrl = new URL(mockNextAuthUrl + "/api/auth/callback/lastfm");

        await actRequest({ method, token: undefined });
      });

      it("should return a 405 status code", () => {
        expect(mockRes._getStatusCode()).toBe(400);
        expect(mockRes._getJSONData()).toStrictEqual(STATUS_400_MESSAGE);
      });
    });
  });

  describe("receives a POST request", () => {
    let expectedUrl: URL;

    beforeEach(() => (method = "POST"));

    describe("with a valid token", () => {
      beforeEach(async () => {
        expectedUrl = new URL(mockNextAuthUrl + "/api/auth/callback/lastfm");
        expectedUrl.searchParams.append("id_token", mockToken);

        await actRequest({ method, token: mockToken });
      });

      it("should return a 405 status code", () => {
        expect(mockRes._getStatusCode()).toBe(405);
        expect(mockRes._getJSONData()).toStrictEqual(STATUS_405_MESSAGE);
      });
    });

    describe("with an invalid token", () => {
      beforeEach(async () => {
        expectedUrl = new URL(mockNextAuthUrl + "/api/auth/callback/lastfm");

        await actRequest({ method, token: undefined });
      });

      it("should return a 405 status code", () => {
        expect(mockRes._getStatusCode()).toBe(405);
        expect(mockRes._getJSONData()).toStrictEqual(STATUS_405_MESSAGE);
      });
    });
  });
});
