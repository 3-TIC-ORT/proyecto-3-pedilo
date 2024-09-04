// import { NextRequest } from 'next/server';
// import { getToken, JWT } from 'next-auth/jwt';
// import { getServerSession } from 'next-auth/next';

// // Utility function to fetch the secret safely
// function getNextAuthSecret() {
//   const secret = process.env.NEXTAUTH_SECRET;
//   if (!secret) {
//     console.error("NEXTAUTH_SECRET is not set");
//     return null;
//   }
//   return secret;
// }

// export async function isAuthenticated(req: NextRequest) {
//   console.log("isAuthenticated: start");

//   const secret = getNextAuthSecret();
//   if (!secret) {
//     return { isAuthenticated: false, user: null };
//   }

//   try {
//     const token = await getToken({ req, secret });

//     if (token) {
//       console.log("authenticated");
//       return {
//         isAuthenticated: true,
//         user: token as JWT,  // Use the JWT type from next-auth/jwt
//       };
//     }

//     console.log("not authenticated");
//     return {
//       isAuthenticated: false,
//       user: null,
//     };
//   } catch (error) {
//     console.error("Error in isAuthenticated:", error);
//     return {
//       isAuthenticated: false,
//       user: null,
//     };
//   }
// }

// export async function getSession(req: NextRequest) {
//   console.log("getSession: start");

//   if (req.headers.get("x-invoke-path")?.startsWith("/api")) {
//     const secret = getNextAuthSecret();
//     if (!secret) {
//       return { user: null };
//     }

//     try {
//       const token = await getToken({ req, secret });

//       if (token) {
//         console.log("user session found");
//         return { user: token as JWT };
//       }

//       console.log("user not found");
//       return { user: null };
//     } catch (error) {
//       console.error("Error in getSession:", error);
//       return { user: null };
//     }
//   }

//   // If it's not an API route, use getServerSession for SSR/SSG
//   return getServerSession(req);
// }


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