import env from "../config/env";
import type { envVarSetType } from "../types/env";

export const AllAccessIdentity = {
  email: "all-access@mla.com",
  name: "Test User",
  picture:
    "https://s.gravatar.com/avatar/cf182ca17010783b59e45d426fcbfdf8?s=80",
  sub: "test-user",
  iat: new Date().getTime(),
  exp: new Date().getTime() + 120,
};

export const NoAccessIdentity = {
  email: "no-ticket@mla.com",
  name: "Test User",
  picture:
    "https://s.gravatar.com/avatar/cf182ca17010783b59e45d426fcbfdf8?s=80",
  sub: "test-user",
  iat: new Date().getTime(),
  exp: new Date().getTime() + 120,
};

export type IdentityType = typeof AllAccessIdentity | typeof NoAccessIdentity;

export const authenticate = (
  authorizationCookieName: string,
  sourceEnvVar: keyof envVarSetType
) => {
  Cypress.Cookies.defaults({
    preserve: authorizationCookieName,
  });
  cy.setCookie(authorizationCookieName, Cypress.env(sourceEnvVar), {
    httpOnly: true,
    domain: Cypress.env(env.BASEURL).split("//")[1],
    expiry: new Date().getTime() + 20000,
    sameSite: "lax",
    secure: true,
  });
};
