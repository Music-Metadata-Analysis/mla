import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import lastfm from "@locales/lastfm.json";
import main from "@locales/main.json";
import routes from "@src/config/routes";

describe("LastFM Report Selection (Disabled)", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 10000;

  before(() => setup());

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are logged in", () => {
        before(() => {
          authenticate(authorizationCookieName, env.SMOKE_TEST_NO_ACCESS_TOKEN);
        });

        describe("when we visit the search selection screen", () => {
          before(() => cy.visit(routes.search.lastfm.selection));

          it("should contain the lastfm logo", () => {
            cy.get(`[alt="${main.altText.lastfm}"]`).should("be.visible", {
              timeout,
            });
          });

          it(`should NOT contain the '${reportConfig.reportName}' report`, () => {
            cy.contains(reportConfig.reportName).should("not.exist", {
              timeout,
            });
          });

          checkBillboardTitleToggle({
            timeout,
            titleText: lastfm.select.title,
          });
        });
      });
    });
  });
});
