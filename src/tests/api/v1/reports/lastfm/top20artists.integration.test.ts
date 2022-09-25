import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import artistHandler from "@src/pages/api/v1/reports/lastfm/top20artists";
import testResponses from "@src/tests/fixtures/lastfm.topartists";
import testAccounts from "@src/tests/fixtures/lastfm.users";
import {
  createAPIMocks,
  mockSession,
} from "@src/tests/fixtures/mock.authentication";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.mock("@src/backend/api/lastfm/endpoint.common.logger", () => {
  return jest.fn((req, res, next) => next());
});

jest.mock("@src/backend/integrations/auth/vendor", () => ({
  Client: jest.fn(() => ({
    getSession: () => Promise.resolve(mockSession),
  })),
}));

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

const integrationEnvironmentVariable = "INTEGRATION_TEST_LAST_FM_KEY";
const endpointUnderTest = apiRoutes.v1.reports.lastfm.top20artists;
const handler = artistHandler;

if (process.env[integrationEnvironmentVariable]) {
  describe(endpointUnderTest, () => {
    let scenario: string;
    let testUser: string;
    let originalEnvironment: typeof process.env;
    let mockReq: MockAPIRequest;
    let mockRes: MockAPIResponse;

    beforeAll(() => {
      originalEnvironment = process.env;
      process.env.LAST_FM_KEY = process.env[integrationEnvironmentVariable];
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      process.env = originalEnvironment;
    });

    const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
      ({ req: mockReq, res: mockRes } = createAPIMocks({
        url: endpointUnderTest,
        method,
        body,
      }));
      await handler(mockReq, mockRes);
    };

    describe("receives a GET request", () => {
      beforeEach(async () => {
        await arrange({ body: {}, method: "GET" });
      });

      it("should return a 405", () => {
        expect(mockRes._getStatusCode()).toBe(405);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
      });
    });

    describe("receives a POST request", () => {
      describe("for a user with no listens", () => {
        beforeEach(() => {
          scenario = "noListens";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            testUser = testAccounts[scenario];
            await arrange({
              body: { userName: testUser },
              method: "POST",
            });
          });

          it("should return a 200 status code, and the expected response", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(
              testResponses[scenario]
            );
          });
        });
      });

      describe("for a user with listens", () => {
        beforeEach(() => {
          scenario = "hasListens";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            testUser = testAccounts[scenario];
            await arrange({
              body: { userName: testUser },
              method: "POST",
            });
          });

          it("should return a 200 status code, and the expected response", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(
              testResponses[scenario]
            );
          });
        });
      });
    });
  });
} else {
  test(`${integrationEnvironmentVariable} is not set, integration tests disabled.`, () => {
    expect(true).toBe(true);
  });
}
