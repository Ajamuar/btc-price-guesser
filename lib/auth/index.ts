import type { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getUserById,
  createUser,
  getUserByEmail,
  verifyPassword,
} from "@/lib/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await getUserByEmail(credentials.email);
        if (!user) return null;
        if (!user.passwordHash) return null;
        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.userId,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user?.id) return false;
      const existing = await getUserById(user.id);
      if (!existing) {
        await createUser(
          user.id,
          user.email ?? null,
          user.name ?? null
        );
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.userId ?? "";
      }
      return session;
    },
  },
};
