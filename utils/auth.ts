import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

export async function isAuthenticated(req: NextApiRequest, res: NextApiResponse) {
  // Attempt to retrieve the session using the request
  console.log("hola")
  const session = await getSession({ req });

  // Check if a valid session exists
  if (session && session.user) {
    // User is authenticated
    console.log("authenticated")
    return {
      isAuthenticated: true,
      user: session.user,
      
    };
  }

  // User is not authenticated
console.log("not authenticated")
  return {
    isAuthenticated: false,
    user: null,
  };
}
