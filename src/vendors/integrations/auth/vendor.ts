import useNextAuth from "./hooks/next-auth";
import NextAuthProvider from "./providers/next-auth";
import type { AuthVendorInterface } from "@src/vendors/types/integrations/auth/vendor.types";

export const authVendor: AuthVendorInterface = {
  hook: useNextAuth,
  Provider: NextAuthProvider,
};
