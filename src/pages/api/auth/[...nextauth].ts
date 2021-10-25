import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import S3Profile from "../../../backend/integrations/auth/s3profile.class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    jwt: {
      secret: process.env.AUTH_MASTER_JWT_SECRET,
      signingKey: process.env.AUTH_MASTER_JWT_SIGNING_KEY,
    },
    session: {
      maxAge: 7 * 24 * 60 * 60,
      jwt: true,
    },
    providers: [
      // @ts-expect-error next-auth library has some typing issues they are working on
      FacebookProvider({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      }),
      GithubProvider({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
      SpotifyProvider({
        clientId: process.env.AUTH_SPOTIFY_ID,
        clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      }),
    ],
    secret: process.env.AUTH_MASTER_SECRET_KEY,
    events: {
      async signIn(message) {
        const s3Client = new S3Profile(process.env.AUTH_EMAILS_BUCKET_NAME);
        await s3Client.writeProfileToS3(message.profile);
      },
    },
  });
}
