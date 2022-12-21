import useNextAuth from "./hooks/next-auth";
import NextAuthProvider from "./providers/next-auth";
import type { AuthVendorInterface } from "@src/types/clients/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  hook: useNextAuth,
  Provider: NextAuthProvider,
};

export default authVendor;
