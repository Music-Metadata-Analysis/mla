import NextAuthClient from "./client/next-auth.client.class";
import ProfilePersistanceClient from "./profile/profile.persistance.client.class";
import createRoutes from "./routes/next-auth.api.routes";
import type { AuthVendor } from "../../../types/integrations/auth/vendor.types";

const authVendor: AuthVendor = {
  Client: NextAuthClient,
  ApiRoutes: createRoutes(ProfilePersistanceClient),
};

export default authVendor;
