import { config, getValueOf } from "@cypress/config";

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
  sourceEnvVar: config
) => {
  Cypress.Cookies.defaults({
    preserve: authorizationCookieName,
  });
  cy.setCookie(authorizationCookieName, getValueOf(sourceEnvVar), {
    httpOnly: true,
    domain: getValueOf(config.BASEURL).split("//")[1],
    expiry: new Date().getTime() + 20000,
    sameSite: "lax",
    secure: true,
  });
};
