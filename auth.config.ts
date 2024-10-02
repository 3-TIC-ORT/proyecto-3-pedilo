import type { NextAuthConfig } from "next-auth"
 
export default {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role; // Assign role to session user
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig