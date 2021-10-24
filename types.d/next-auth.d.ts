import type * as NextAuth from "next-auth";

declare module "next-auth" {
  namespace extendedTypes {
    export interface SignInMessageInterface {
      user: NextAuth.User;
      account: NextAuth.Account;
      profile?: NextAuth.Profile;
      isNewUser?: boolean;
    }
  }
}
