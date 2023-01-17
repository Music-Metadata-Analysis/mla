import {} from "@fixtures/api/mock.api.auth";
import {} from "@fixtures/api/mock.api.logger";
import { createAPIMocks } from "@fixtures/api/mock.api.messages";
import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import testResponses from "@src/contracts/api/fixtures/services/lastfm/end2end/lastfm.topalbums";
import testAccounts from "@src/contracts/api/fixtures/services/lastfm/end2end/lastfm.users";
import albumHandler from "@src/pages/api/v2/reports/lastfm/top20albums/[username]";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/backend/api/exports/types/mocks";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/exports/types/client";

jest.unmock("@toplast/lastfm");

type ArrangeArgs = {
  username: string;
  method: HttpApiClientHttpMethodType;
};

const integrationEnvironmentVariable = "INTEGRATION_TEST_LAST_FM_KEY";
const endpointUnderTest = apiRoutes.v2.reports.lastfm.top20albums;
const handler = albumHandler;

if (process.env[integrationEnvironmentVariable]) {
  describe(endpointUnderTest, () => {
    let scenario: string;
    let testUser: string;
    let originalEnvironment: typeof process.env;
    let mockReq: MockAPIEndpointRequestType;
    let mockRes: MockAPIEndpointResponseType;

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
