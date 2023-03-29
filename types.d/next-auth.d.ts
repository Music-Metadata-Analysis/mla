import { DefaultSession, Profile as DefaultProfile } from "next-auth";

// nextauth.d.ts
declare module "next-auth" {
  interface Session extends DefaultSession {
    group?: string;
  }

  interface Profile extends DefaultProfile {
    group: string | null;
  }
}
