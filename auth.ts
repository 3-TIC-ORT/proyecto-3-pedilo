import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/definitions"
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"


export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null

          const { email, password } = await signInSchema.parseAsync(credentials)


          // logic to verify if the user exists
          user = async () => {
            user = await prisma.user.findUnique({
              where: { email: email },
            });
            if (user && await compare(password, user.password)) {
              // Password matched
              return { id: user.id, name: user.name, email: user.email };
            }

          }


          if (!user) {
            throw new Error("User not found.")
          }

          // return JSON object with the user data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
      },
    }),
  ],
})
