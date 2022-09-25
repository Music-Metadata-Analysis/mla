import NextAuthClient from "./client/next-auth";
import ProfilePersistanceClient from "./profile/profile.persistance.client.class";
import createRoutes from "./routes/next-auth";
import type { AuthVendor } from "@src/types/integrations/auth/vendor.types";

const authVendor: AuthVendor = {
  Client: NextAuthClient,
  ApiRoutes: createRoutes(ProfilePersistanceClient),
};

export default authVendor;
