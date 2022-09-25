import env from "@cypress/config/env";
import authVendor from "@cypress/vendors/auth/vendor";

const cookiePrefix = Cypress.env(env.BASEURL).includes("localhost")
  ? ""
  : "__Secure-";

export const getAuthorizationCookieName = () => {
  const authorizationCookieName =
    cookiePrefix + authVendor.authorizationCookieName;
  return authorizationCookieName;
};
