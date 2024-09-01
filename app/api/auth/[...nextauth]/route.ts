import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

// Initialize Prisma Client
const prisma = new PrismaClient();

// NextAuth.js configuration
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Find the user from your database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user && await compare(credentials.password, user.password)) {
            // Password matched
            return { id: user.id, name: user.name, email: user.email };
          } else {
            // Invalid credentials
            console.log("Invalid credentials provided.");
            return null;
          }
        } catch (error) {
          console.error("Error during user authentication:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",  // Specify custom sign-in page
    error: "/auth/error", // Error page URL
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/signup" // New users will be directed here on first sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Add user ID to token payload
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;  // Add user ID to session object
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',  // Use JWT strategy for session handling
  },
  adapter: PrismaAdapter(prisma),  // Add Prisma adapter
  secret: process.env.NEXTAUTH_SECRET,  // Ensure you have this set in your environment variables
};

// NextAuth.js handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

