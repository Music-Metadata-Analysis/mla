import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import settings from "../../../../config/auth";
import type { ProfilePersistanceClientConstructorType } from "../../../../types/integrations/auth/vendor.types";
import type { NextApiRequest, NextApiResponse } from "next";

const createRoutes = (
  PersistanceClient: ProfilePersistanceClientConstructorType
) => {
  return async function NextAuthApiRoutes(req: unknown, res: unknown) {
    return await NextAuth(req as NextApiRequest, res as NextApiResponse, {
      jwt: {
        secret: process.env.AUTH_MASTER_JWT_SECRET,
      },
      session: {
        maxAge: settings.maxAge,
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
          const client = new PersistanceClient(
            process.env.AUTH_EMAILS_BUCKET_NAME
          );
          await client.persistProfile(message.profile);
        },
      },
    });
  };
};

export default createRoutes;
