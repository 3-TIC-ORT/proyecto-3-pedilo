import type { DefaultSession } from "next-auth"
import DefaultUser from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      surname: string | null
      email: string
      role: string | null
    } & DefaultSession["user"]
  }
  interface User {
    role: string | null
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string | null
  }
}
