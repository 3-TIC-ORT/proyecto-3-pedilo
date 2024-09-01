import { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function isAuthenticated(req: NextRequest) {
  console.log("isAuthenticated: start");

  const secret = process.env.NEXTAUTH_SECRET;
  // Use JWT token from NextAuth.js for checking authentication
  const token = await getToken({ req: req, secret: secret });
  console.log(token);
  if (token) {
    console.log("authenticated");
    return {
      isAuthenticated: true,
      user: token,  // Use the decoded JWT token as user info
    };
  }

  console.log("not authenticated");
  return {
    isAuthenticated: false,
    user: null,
  };
}

