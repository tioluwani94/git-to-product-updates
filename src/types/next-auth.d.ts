import NextAuth, { DefaultSession } from "next-auth";
import { User, UserProfile } from ".";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user: DefaultSession["user"];
    provider: string;
    profile: any;
  }
}
