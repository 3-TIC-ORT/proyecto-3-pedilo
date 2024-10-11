import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "verification@pedilo.tech"
    }),
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verifyRequest=true',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role; // Assign role to session user
      }
      return session;
    },
  },
});
