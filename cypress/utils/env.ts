import { loadEnvConfig } from "@next/env";
import { writeFile } from "fs";
import { AllAccessIdentity, NoAccessIdentity } from "../fixtures/auth";
import authVendor from "../vendors/auth/vendor";
import type { envVarType } from "../types/env";

const environmentFile = "cypress.env.json";

const loadEnvironment = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

loadEnvironment()
  .then(() => {
    const allAccess = authVendor.generateToken(AllAccessIdentity);
    const noAccess = authVendor.generateToken(NoAccessIdentity);
    return Promise.all([allAccess, noAccess]);
  })
  .then((tokens) => {
    const content = JSON.stringify({
      BASEURL: process.env.NEXTAUTH_URL,
      FLAG_GROUPS_HASH: process.env.FLAG_GROUPS_HASH,
      NEXT_PUBLIC_FLAG_ENVIRONMENT: process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT,
      SMOKE_TEST_ALL_ACCESS_TOKEN: tokens[0],
      SMOKE_TEST_NO_ACCESS_TOKEN: tokens[1],
    } as envVarType);
    writeFile(environmentFile, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
