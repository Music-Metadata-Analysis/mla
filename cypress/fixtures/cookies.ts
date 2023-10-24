import { config, getValueOf } from "@cypress/config";
import authVendor from "@cypress/vendors/auth/vendor";

const cookiePrefix = getValueOf(config.BASEURL).includes("localhost")
  ? ""
  : "__Secure-";

export const getAuthorizationCookieName = () => {
  const authorizationCookieName =
    cookiePrefix + authVendor.authorizationCookieName;
  return authorizationCookieName;
};
