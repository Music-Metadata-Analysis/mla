import * as env from "@next/env";
import * as jwt from "next-auth/jwt";
import fs from "fs";
const environmentFile = "cypress.env.json";

const loadEnvironment = async () => {
  const projectDir = process.cwd();
  env.default.loadEnvConfig(projectDir);
};

async function generateToken() {
  const settings = {
    secret: process.env.AUTH_MASTER_JWT_SECRET,
    signingKey: process.env.AUTH_MASTER_JWT_SIGNING_KEY,
  };

  const defaultJwtPayload = {
    name: "Test User",
    sub: "test-user",
    email: "testing@sharedvisionsolutions.com",
    picture: "http://test.user.only",
    iat: new Date().getTime(),
    exp: new Date().getTime() + 120,
  };

  return await jwt.encode({ ...settings, token: defaultJwtPayload });
}

loadEnvironment()
  .then(() => generateToken())
  .then((token) => {
    const content = JSON.stringify({
      SMOKE_TEST_TOKEN: token,
      BASEURL: process.env.NEXTAUTH_URL,
    });
    fs.writeFile(environmentFile, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
