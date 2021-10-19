import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import apiRoutes from "../../../../../config/apiRoutes";
import * as status from "../../../../../config/status";
import albumHandler from "../../../../../pages/api/v1/reports/lastfm/top20albums";
import testResponses from "../../../../fixtures/lastfm.topalbums";
import testAccounts from "../../../../fixtures/lastfm.users";
import type { HttpMethodType } from "../../../../../types/clients/api/api.client.types";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("../../../../../api/lastfm/endpoint.logger", () => {
  return jest.fn((req, res, next) => next());
});

type ArrangeArgs = {
  body: Record<string, unknown>;
  method: HttpMethodType;
};

const integrationEnvironmentVariable = "INTEGRATION_TEST_LAST_FM_KEY";
const endpointUnderTest = apiRoutes.v1.reports.lastfm.top20albums;
const handler = albumHandler;

if (process.env[integrationEnvironmentVariable]) {
  describe(endpointUnderTest, () => {
    let scenario: string;
    let testUser: string;
    let originalEnvironment: typeof process.env;
    let req: MockRequest<NextApiRequest>;
    let res: MockResponse<NextApiResponse>;

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
      ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
        url: endpointUnderTest,
        method,
        body,
      }));
      await handler(req, res);
    };

    describe("receives a GET request", () => {
      beforeEach(async () => {
        await arrange({ body: {}, method: "GET" });
      });

      it("should return a 405", () => {
        expect(res._getStatusCode()).toBe(405);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
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
            expect(res._getStatusCode()).toBe(200);
            expect(res._getJSONData()).toStrictEqual(testResponses[scenario]);
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
            expect(res._getStatusCode()).toBe(200);
            expect(res._getJSONData()).toStrictEqual(testResponses[scenario]);
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
