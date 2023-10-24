import { config } from "@cypress/config";
import { getAuthorizationCookieName } from "@cypress/fixtures/cookies";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import { authenticate } from "@cypress/fixtures/spec/auth.spec";
import checkBillboardTitleToggle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import checkSelectIndicatorToggle from "@cypress/fixtures/spec/responsiveness/lastfm.select.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import lastfm from "@locales/lastfm.json";

describe("LastFM Report Selection (Enabled)", () => {
  const authorizationCookieName = getAuthorizationCookieName();
  const reports = flipCardReports.concat(sunBurstReports);
  const timeout = 10000;

  before(() => setup());

  reports.forEach((reportConfig) => {
    describe(reportConfig.reportName, () => {
      describe("when we are logged in", () => {
        before(() =>
          authenticate(
            authorizationCookieName,
            config.SMOKE_TEST_ALL_ACCESS_TOKEN
          )
        );

        checkSelectIndicatorToggle({ reportConfig, timeout });
        checkBillboardTitleToggle({ timeout, titleText: lastfm.select.title });
      });
    });
  });
});
