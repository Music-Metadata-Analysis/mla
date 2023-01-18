import useNextAuth from "./web/hooks/next-auth";
import NextAuthProvider from "./web/providers/next-auth";
import type { AuthVendorInterface } from "@src/vendors/types/integrations/auth/vendor.types";

export const authVendor: AuthVendorInterface = {
  hook: useNextAuth,
  Provider: NextAuthProvider,
};
