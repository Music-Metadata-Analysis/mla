import * as jwt from "next-auth/jwt";

export default async function generateNextAuthToken() {
  const settings = {
    secret: process.env.AUTH_MASTER_JWT_SECRET as string,
  };

  const defaultJwtPayload = {
    name: "Test User",
    sub: "test-user",
    email: "testing@sharedvisionsolutions.com",
    picture: "http://test.user.only",
    iat: new Date().getTime(),
    exp: new Date().getTime() + 120,
  };

  return await jwt.encode({ ...settings, token: defaultJwtPayload });
}
