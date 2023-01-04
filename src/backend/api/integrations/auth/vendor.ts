import NextAuthClient from "./client/next-auth";
import nextAuthConfiguration from "./config/next-auth";
import ProfilePersistenceClient from "./profile/profile.persistence.client.class";
import createRoutes from "./routes/next-auth";
import type { AuthVendorInterface } from "@src/backend/api/types/integrations/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  ApiRoutes: createRoutes(ProfilePersistenceClient),
  Client: NextAuthClient,
  config: nextAuthConfiguration,
};

export default authVendor;
