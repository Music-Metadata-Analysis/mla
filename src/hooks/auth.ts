import authVendor from "@src/clients/auth/vendor";
import type { AuthVendorHookInterface } from "@src/types/clients/auth/vendor.types";

const useAuth = (): AuthVendorHookInterface => {
  const authHook = authVendor.hook();
  return authHook;
};

export default useAuth;
