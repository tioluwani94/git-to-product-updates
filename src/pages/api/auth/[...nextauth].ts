import { ClickUpProfile } from "@/types";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "user,repo" },
      },
    }),
    {
      id: "clickup",
      name: "ClickUp",
      type: "oauth",
      authorization: "https://app.clickup.com/api",
      token: `${process.env.CLICKUP_BASE_URL}/oauth/token`,
      userinfo: `${process.env.CLICKUP_BASE_URL}/user`,
      clientId: process.env.CLICKUP_CLIENT_ID,
      clientSecret: process.env.CLICKUP_CLIENT_SECRET,
      checks: ["state"],
      profile: (profile: ClickUpProfile) => {
        return {
          id: profile.user.id.toString(),
          name: profile.user.username,
          profilePicture: profile.user.profilePicture,
          color: profile.user.color,
        };
      },
      options: {
        clientId: process.env.CLICKUP_CLIENT_ID,
        clientSecret: process.env.CLICKUP_CLIENT_SECRET,
      },
    },
    {
      id: "linear",
      name: "Linear",
      type: "oauth",
      authorization: {
        url: "https://linear.app/oauth/authorize",
        params: {
          scope: "read",
          approval_prompt: "consent",
          response_type: "code",
          redirect_uri: "http://localhost:3000/api/auth/callback/linear",
        },
      },
      userinfo: {
        url: "https://api.linear.app/graphql",
        async request(context: any) {
          const res = await fetch("https://api.linear.app/graphql", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
              "User-Agent": "authjs",
              "Content-Type": "application/json",
            },
            body: '{"query":"{ viewer { id name email avatarUrl description} }"}',
          });
          const data = await res.json();
          return {
            id: data.data.viewer.id,
            name: data.data.viewer.name,
            email: data.data.viewer.email,
            avatarUrl: data.data.viewer.avatarUrl,
            description: data.data.viewer.description,
          };
        },
      },
      token: "https://api.linear.app/oauth/token",
      async profile(profile: any) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatarUrl,
        };
      },
      clientId: process.env.LINEAR_ID,
      clientSecret: process.env.LINEAR_SECRET,
    },
  ],
  callbacks: {
    async jwt(options: any) {
      const { account, token, profile } = options;
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.profile = token.profile;
      session.provider = token.provider;
      return session;
    },
  },
};
export default NextAuth(authOptions);
