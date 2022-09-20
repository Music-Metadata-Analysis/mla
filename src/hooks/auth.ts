import authVendor from "../clients/auth/vendor";
import type { AuthVendorHookInterface } from "../types/clients/auth/vendor.types";

const useAuth = (): AuthVendorHookInterface => {
  const authHook = authVendor.hook();
  return authHook;
};

export default useAuth;
