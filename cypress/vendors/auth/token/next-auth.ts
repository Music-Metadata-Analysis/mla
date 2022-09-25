import * as jwt from "next-auth/jwt";
import type { IdentityType } from "@cypress/fixtures/auth";

export default async function generateNextAuthToken(identity: IdentityType) {
  const settings = {
    secret: process.env.AUTH_MASTER_JWT_SECRET as string,
  };

  const encoded = await jwt.encode({
    ...settings,
    token: { ...identity },
  });

  return encoded;
}
