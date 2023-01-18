import NextAuthClient from "./backend/client/next-auth";
import nextAuthConfiguration from "./backend/config/next-auth";
import ProfilePersistenceClient from "./backend/profile/profile.persistence.client.class";
import createRoutes from "./backend/routes/next-auth";
import type { AuthVendorBackendInterface } from "@src/vendors/types/integrations/auth/vendor.backend.types";

export const authVendorBackend: AuthVendorBackendInterface = {
  ApiRoutes: createRoutes(ProfilePersistenceClient),
  Client: NextAuthClient,
  config: nextAuthConfiguration,
};
