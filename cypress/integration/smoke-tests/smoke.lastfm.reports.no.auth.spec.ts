import { config, getValueOf } from "@cypress/config";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { checkAuthenticationModal } from "@cypress/fixtures/spec/components/authentication.modal.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import type { CypressReportType } from "@cypress/types/reports";

describe("LastFM Report Viewing (Unauthenticated)", () => {
  const timeout = 5000;

  const reports: CypressReportType[] = flipCardReports.concat(sunBurstReports);

  before(() => setup());

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are NOT logged in", () => {
        before(() => cy.reload(true));

        describe("when we visit the report screen", () => {
          before(() => {
            cy.visit(
              reportConfig.reportRoute +
                `?username=${getValueOf(
                  config.LASTFM_TEST_ACCOUNT_WITH_LISTENS
                )}`
            );
          });

          checkAuthenticationModal({ timeout });
        });
      });
    });
  });
});
