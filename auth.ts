import NextAuth, { type DefaultSession } from "next-auth"
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/definitions";
import { compare } from "bcryptjs";
import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Passkey from "next-auth/providers/passkey";
import DefaultUser from 'next-auth';


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      surname: string | null
      email: string
      role: string | null
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}
declare module "@auth/core/adapters" {
  interface AdapterUser {
    // Add your additional properties here:
    role: string | null
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
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
    Passkey({
      //   profile(profile) {
      //     return {
      //       id: profile.sub,
      //       name: profile.name,
      //       email: profile.email,
      //       image: profile.picture,
      //       role: profile.role ?? "user",
      //     };
      //   },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // profile(profile) {
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //     role: profile.role ?? "user",
      //   };
      // },
      //
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          // logic to verify if the user exists
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (user && user.password && await compare(password, user.password)) {
            // Password matched, return user object
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role, // assuming user has a role field
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
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role; // Assign role to session user
      }
      return session;
    },
  },
  experimental: { enableWebAuthn: true }, // Move experimental outside callbacks
});

