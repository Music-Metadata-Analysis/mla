import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import ProfilePersistanceClient from "../../../backend/integrations/auth/profile.persistance.client.class";
import settings from "../../../config/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
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
        const client = new ProfilePersistanceClient(
          process.env.AUTH_EMAILS_BUCKET_NAME
        );
        await client.persistProfile(message.profile);
      },
    },
  });
}
