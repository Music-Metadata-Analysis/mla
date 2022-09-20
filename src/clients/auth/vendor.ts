import useNextAuth from "./hooks/next-auth";
import NextAuthProvider from "./providers/next-auth";
import type { AuthVendor } from "../../types/clients/auth/vendor.types";

const authVendor: AuthVendor = {
  hook: useNextAuth,
  Provider: NextAuthProvider,
};

export default authVendor;
