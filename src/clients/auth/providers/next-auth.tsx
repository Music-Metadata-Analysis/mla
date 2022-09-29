import { SessionProvider } from "next-auth/react";
import type { AuthVendorProviderProps } from "@src/types/clients/auth/vendor.types";

const NextAuthProvider = ({ session, children }: AuthVendorProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;