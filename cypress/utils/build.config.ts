import { loadEnvConfig } from "@next/env";
import { writeFile } from "fs";
import { flipCardReports, sunBurstReports } from "@cypress/fixtures/reports";
import {
  AllAccessIdentity,
  NoAccessIdentity,
} from "@cypress/fixtures/spec/auth.spec";
import authVendor from "@cypress/vendors/auth/vendor";
import testAccounts from "@src/contracts/api/services/lastfm/fixtures/end2end/lastfm.users";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type { CypressConfigurationType } from "@cypress/types/config";
import type { CypressFlagEnabledReportType } from "@cypress/types/reports";

const environmentFile = "cypress.env.json";

const loadEnvironment = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

const loadEnabledReports = async () => {
  const enabledReports: CypressFlagEnabledReportType[] = [];
  const reports = flipCardReports.concat(sunBurstReports);
  const client = new flagVendorBackend.Client(
    process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT
  );
  for (let i = 0; i < reports.length; i++) {
    const enabled = await client.isEnabled(reports[i].flag);
    enabledReports.push({ ...reports[i], enabled });
  }
  return enabledReports;
};

loadEnvironment()
  .then(() => {
    const allAccess = authVendor.generateToken(AllAccessIdentity);
    const noAccess = authVendor.generateToken(NoAccessIdentity);
    return Promise.all([allAccess, noAccess]);
  })
  .then(async (tokens) => {
    const content = JSON.stringify({
      BASEURL: process.env.NEXTAUTH_URL,
      FLAG_ENABLED_REPORTS: JSON.stringify(await loadEnabledReports()),
      FLAG_GROUPS_HASH: process.env.FLAG_GROUPS_HASH,
      LASTFM_TEST_ACCOUNT_NO_LISTENS: testAccounts.noListens,
      LASTFM_TEST_ACCOUNT_WITH_LISTENS: testAccounts.hasListens,
      SMOKE_TEST_ALL_ACCESS_TOKEN: tokens[0],
      SMOKE_TEST_NO_ACCESS_TOKEN: tokens[1],
    } as CypressConfigurationType);
    writeFile(environmentFile, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
