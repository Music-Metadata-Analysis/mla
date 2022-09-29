import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import trackHandler from "@src/pages/api/v1/reports/lastfm/top20tracks";
import testResponses from "@src/tests/fixtures/lastfm/end2end/lastfm.toptracks";
import testAccounts from "@src/tests/fixtures/lastfm/end2end/lastfm.users";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "@src/types/api.endpoint.types";
import type { HttpMethodType } from "@src/types/clients/api/api.client.types";

jest.unmock("@toplast/lastfm");

jest.mock("@src/backend/integrations/auth/vendor", () =>
  require("@fixtures/integrations/auth").authenticated()
);

jest.mock("@src/backend/api/lastfm/endpoint.common.logger");

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

const integrationEnvironmentVariable = "INTEGRATION_TEST_LAST_FM_KEY";
const endpointUnderTest = apiRoutes.v1.reports.lastfm.top20tracks;
const handler = trackHandler;

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
