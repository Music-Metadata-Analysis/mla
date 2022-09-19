import { loadEnvConfig } from "@next/env";
import { writeFile } from "fs";
import authVendor from "../vendors/auth/vendor";

const environmentFile = "cypress.env.json";

const loadEnvironment = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

loadEnvironment()
  .then(() => authVendor.generateToken())
  .then((token) => {
    const content = JSON.stringify({
      SMOKE_TEST_TOKEN: token,
      BASEURL: process.env.NEXTAUTH_URL,
    });
    writeFile(environmentFile, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
