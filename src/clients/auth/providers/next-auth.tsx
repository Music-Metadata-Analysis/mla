import { SessionProvider } from "next-auth/react";
import type { AuthVendorProviderProps } from "../../../types/clients/auth/vendor.types";
import type { Session } from "next-auth";

const NextAuthProvider = ({ session, children }: AuthVendorProviderProps) => {
  return (
    <SessionProvider session={session as Session}>{children}</SessionProvider>
  );
};

export default NextAuthProvider;
