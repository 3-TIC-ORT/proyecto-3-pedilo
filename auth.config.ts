import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google";
import Passkey from "next-auth/providers/passkey";
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials";

export default {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role; // Assign role to session user
      }
      return session;
    },
  },
  providers: [Google, Passkey, Credentials],
} satisfies NextAuthConfig
