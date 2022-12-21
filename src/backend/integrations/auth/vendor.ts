import NextAuthClient from "./client/next-auth";
import nextAuthConfiguration from "./config/next-auth";
import ProfilePersistanceClient from "./profile/profile.persistance.client.class";
import createRoutes from "./routes/next-auth";
import type { AuthVendorInterface } from "@src/types/integrations/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  ApiRoutes: createRoutes(ProfilePersistanceClient),
  Client: NextAuthClient,
  config: nextAuthConfiguration,
};

export default authVendor;
