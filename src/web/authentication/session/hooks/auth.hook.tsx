import { authVendor } from "@src/vendors/integrations/auth/vendor";
import type { AuthVendorHookInterface } from "@src/vendors/types/integrations/auth/vendor.types";

const useAuth = (): AuthVendorHookInterface => {
  const authHook = authVendor.hook();
  return authHook;
};

export default useAuth;

export type AuthHookType = ReturnType<typeof useAuth>;
