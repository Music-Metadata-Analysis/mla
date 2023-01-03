import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import artistHandler from "@src/pages/api/v2/reports/lastfm/top20artists/[username]";
import testResponses from "@src/tests/fixtures/lastfm/end2end/lastfm.topartists";
import testAccounts from "@src/tests/fixtures/lastfm/end2end/lastfm.users";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type { APIClientHttpMethodType } from "@src/contracts/api/exports.types";
import type { MockAPIRequestType } from "@src/types/api/request.types";
import type { MockAPIResponseType } from "@src/types/api/response.types";

jest.unmock("@toplast/lastfm");

jest.mock("@src/backend/api/integrations/auth/vendor", () =>
  require("@fixtures/api/auth").authenticated()
);

jest.mock("@src/backend/api/integrations/api.logger/vendor");

type ArrangeArgs = {
  username: string;
  method: APIClientHttpMethodType;
};

const integrationEnvironmentVariable = "INTEGRATION_TEST_LAST_FM_KEY";
const endpointUnderTest = apiRoutes.v2.reports.lastfm.top20artists;
const handler = artistHandler;

if (process.env[integrationEnvironmentVariable]) {
  describe(endpointUnderTest, () => {
    let scenario: string;
    let testUser: string;
    let originalEnvironment: typeof process.env;
    let mockReq: MockAPIRequestType;
    let mockRes: MockAPIResponseType;

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

    const arrange = async ({ username, method = "GET" }: ArrangeArgs) => {
      ({ req: mockReq, res: mockRes } = createAPIMocks({
        url: endpointUnderTest,
        method,
        query: { username },
      }));
      await handler(mockReq, mockRes);
    };

    describe("receives a POST request", () => {
      beforeEach(async () => {
        await arrange({ username: "mockUserName", method: "POST" });
      });

      it("should return a 405", () => {
        expect(mockRes._getStatusCode()).toBe(405);
        expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
      });
    });

    describe("receives a GET request", () => {
      describe("for a user with no listens", () => {
        beforeEach(() => {
          scenario = "noListens";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            testUser = testAccounts[scenario];
            await arrange({
              username: testUser,
              method: "GET",
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
              username: testUser,
              method: "GET",
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
