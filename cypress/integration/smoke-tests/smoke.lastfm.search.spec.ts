import env from "@cypress/config/env";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import checkNavBarInputToggle from "@cypress/fixtures/spec/responsiveness/navbar.visibility.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import routes from "@src/config/routes";
import { fields } from "@src/web/forms/lastfm/components/username/username.form.identifiers";

describe("LastFM Search Dialogues (Enabled)", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 20000;

  before(() => setup());

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are logged in", () => {
        before(() => {
          authenticate(
            authorizationCookieName,
            env.SMOKE_TEST_ALL_ACCESS_TOKEN
          );
        });

        describe("when we visit the search selection screen", () => {
          before(() => cy.visit(routes.search.lastfm.selection));

          it(`should contain the '${reportConfig.reportName}' report`, () => {
            cy.contains(reportConfig.reportName, { timeout }).should(
              "be.visible",
              { timeout }
            );
          });

          describe(`when we click the '${reportConfig.reportName}' button`, () => {
            before(() => {
              cy.contains(reportConfig.reportName, { timeout }).click();
            });

            it("should display an input field for a lastfm username", () => {
              cy.get(`input[name="${fields.username}"]`, { timeout });
            });

            checkBillboardTitleToggle({
              timeout,
              titleText: reportConfig.searchTitle,
            });
            checkNavBarInputToggle({ timeout });
          });
        });
      });
    });
  });
});
