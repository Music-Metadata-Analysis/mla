import generateNextAuthToken from "./token/next-auth";
import type { AuthVendorInterface } from "../../types/vendors/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  authorizationCookieName: "next-auth.session-token",
  generateToken: generateNextAuthToken,
};

export default authVendor;
