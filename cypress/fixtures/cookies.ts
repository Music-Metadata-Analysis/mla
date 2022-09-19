import authVendor from "../vendors/auth/vendor";

const cookiePrefix = Cypress.env("BASEURL").includes("localhost")
  ? ""
  : "__Secure-";

export const getAuthorizationCookieName = () => {
  const authorizationCookieName =
    cookiePrefix + authVendor.authorizationCookieName;
  return authorizationCookieName;
};
