import routes from "../../../src/config/routes";
import env from "../../config/env";
import { authenticate } from "../../fixtures/auth";
import { getAuthorizationCookieName } from "../../fixtures/cookies";
import { flipCardReports, sunBurstReports } from "../../fixtures/reports";
import { baseUrl } from "../../fixtures/setup";

describe("LastFM Report Selection", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(Object.values(sunBurstReports));

  before(() => {
    baseUrl();
    authenticate(authorizationCookieName, env.SMOKE_TEST_ALL_ACCESS_TOKEN);
    cy.visit("/");
  });

  reports.forEach((report) => {
    describe(report, () => {
      describe("when we are logged in", () => {
        describe("when we visit the search selection screen", () => {
          beforeEach(() => cy.visit(routes.search.lastfm.selection));

          it(`should contain the '${report}' report`, () => {
            cy.contains(report).should("be.visible");
          });
        });
      });
    });
  });
});
