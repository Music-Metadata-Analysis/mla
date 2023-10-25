import { config } from "@cypress/config";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.cy";
import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.cy";
import { setup } from "@cypress/fixtures/spec/setup.cy";
import lastfm from "@locales/lastfm.json";
import main from "@locales/main.json";
import routes from "@src/config/routes";

describe("LastFM Report Selection (Disabled)", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 10000;

  before(() => {
    setup();
  });

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are logged in", () => {
        before(() => {
          authenticate(
            authorizationCookieName,
            config.SMOKE_TEST_NO_ACCESS_TOKEN
          );
          cy.visit(routes.search.lastfm.selection);
        });

        describe("when we visit the search selection screen", () => {
          it("should contain the lastfm logo", () => {
            cy.get(`[alt="${main.altText.lastfm}"]`).should("be.visible", {
              timeout,
            });
          });

          it(`should NOT contain the '${reportConfig.reportName}' report`, () => {
            cy.get(reportConfig.reportName).should("not.exist", {
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
