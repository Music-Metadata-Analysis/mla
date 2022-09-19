import env from "../config/env";
import authVendor from "../vendors/auth/vendor";

const cookiePrefix = Cypress.env(env.BASEURL).includes("localhost")
  ? ""
  : "__Secure-";

export const getAuthorizationCookieName = () => {
  const authorizationCookieName =
    cookiePrefix + authVendor.authorizationCookieName;
  return authorizationCookieName;
};
