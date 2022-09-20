import NextAuthSSR from "./ssr/next-auth";
import type { AuthVendorSSR } from "../../types/clients/auth/vendor.types";

const authVendorSSR: AuthVendorSSR = {
  Client: NextAuthSSR,
};

export default authVendorSSR;
