import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import nextAuthConfiguration from "@src/backend/integrations/auth/config/next-auth";
import flagVendor from "@src/backend/integrations/flags/vendor";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/types/integrations/api.framework/vendor.types";
import type { AuthVendorProfilePersistenceClientConstructorType } from "@src/types/integrations/auth/vendor.types";

export const getGroup = (identifier: unknown) => {
  const hashAsString = JSON.parse(
    (process.env.FLAG_GROUPS_HASH as string) || "{}"
  );
  return new flagVendor.Group(hashAsString).getFromIdentifier(
    identifier as string | undefined | null
  );
};

const createRoutes = (
  PersistenceClient: AuthVendorProfilePersistenceClientConstructorType
) => {
  return async function NextAuthApiRoutes(req: unknown, res: unknown) {
    return await NextAuth(
      req as ApiFrameworkVendorApiRequestType,
      res as ApiFrameworkVendorApiResponseType,
      {
        callbacks: {
          jwt: async ({ token }) => {
            if (token) {
              const group = getGroup(token.email);
              token.group = group;
            }
            return token;
          },
          session: async ({ session, token }) => {
            if (session && token) {
              session.group = String(token.group);
            }
            return session;
          },
        },
        jwt: {
          secret: process.env.AUTH_MASTER_JWT_SECRET,
        },
        session: {
          maxAge: nextAuthConfiguration.maxAge,
          strategy: "jwt",
        },
        providers: [
          FacebookProvider({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
          }),
          GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
          SpotifyProvider({
            clientId: process.env.AUTH_SPOTIFY_ID,
            clientSecret: process.env.AUTH_SPOTIFY_SECRET,
          }),
        ],
        secret: process.env.AUTH_MASTER_SECRET_KEY,
        events: {
          async signIn(message) {
            const client = new PersistenceClient(
              process.env.AUTH_EMAILS_BUCKET_NAME
            );
            if (message.profile) {
              message.profile.group = getGroup(message.profile.email);
            }
            await client.persistProfile(message.profile);
          },
        },
      }
    );
  };
};

export default createRoutes;
