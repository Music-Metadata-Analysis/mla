import NextAuthSSR from "./ssr/next-auth";
import type { AuthVendorSSRInterface } from "@src/types/clients/auth/vendor.types";

const authVendorSSR: AuthVendorSSRInterface = {
  Client: NextAuthSSR,
};

export default authVendorSSR;
