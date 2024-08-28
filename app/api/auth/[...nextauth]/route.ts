import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {  // Corrected "authorize" spelling
        if (!credentials) return null;

        // Find user from your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await compare(credentials.password, user.password))) {
          // If password matches, return the user object
          return user;
        }

        // Return null if user data could not be retrieved or password doesn't match
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup", // Redirect here after sign up
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
