import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config"
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import { ZodError } from "zod";
import { signInSchema } from "@/lib/definitions";
import { compareSync } from 'bcrypt-edge';



export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          // logic to verify if the user exists
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (user && user.password && await compareSync(password, user.password)) {
            // Password matched, return user object
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          // If user or password is incorrect, throw error
          console.log("User not found or password mismatch.");
          throw new Error("Invalid credentials");
        } catch (error) {
          if (error instanceof ZodError) {
            console.log("Validation error:", error);
            // Return null to indicate invalid credentials
            return null;
          }
          throw error;
        }
      },
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.name || typeof credentials.name !== 'string') {
          throw new Error("Name is required for guest sign-in");
        }

        // Create a new guest user
        const guestUser = await prisma.user.create({
          data: {
            name: credentials.name,
            email: `guest_${Date.now()}@example.com`, // Unique email
            role: "guest",
          },
        });

        return {
          id: guestUser.id,
          email: guestUser.email,
          name: guestUser.name,
          role: guestUser.role,
        };
      },
    }),
  ],

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role; // Assign role to session user
      }
      return session;
    },
  },
});

