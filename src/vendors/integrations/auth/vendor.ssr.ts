import NextAuthSSRClient from "./ssr/client/next-auth";
import type { AuthVendorSSRInterface } from "@src/vendors/types/integrations/auth/vendor.ssr.types";

export const authVendorSSR: AuthVendorSSRInterface = {
  Client: NextAuthSSRClient,
};
