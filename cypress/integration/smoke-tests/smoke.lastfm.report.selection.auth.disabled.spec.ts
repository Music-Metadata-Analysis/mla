import env from "@cypress/config/env";
import { authenticate } from "@cypress/fixtures/auth";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { baseUrl } from "@cypress/fixtures/setup";
import routes from "@src/config/routes";

describe("LastFM Report Selection (Disabled)", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(Object.values(sunBurstReports));

  before(() => baseUrl());

  reports.forEach((report) => {
    describe(report, () => {
      describe("when we are logged in", () => {
        before(() => {
          authenticate(authorizationCookieName, env.SMOKE_TEST_NO_ACCESS_TOKEN);
        });

        describe("when we visit the search selection screen", () => {
          before(() => cy.visit(routes.search.lastfm.selection));

          it(`should NOT contain the '${report}' report`, () => {
            cy.contains(report).should("not.exist");
          });
        });
      });
    });
  });
});
