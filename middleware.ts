// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { auth } from "@/auth";
import NextAuth from "next-auth"
import authConfig from "./auth.config"

export const { auth: middleware } = NextAuth(authConfig)
// const protectedRoutes = ["/admin", "/profile"];

//
// export default auth((req) => {
//   const session = !!req.auth;
//   console.log(req.auth);
//   const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
//   if (isProtected && !session) {
//     console.log("middleware: not Authenticated");
//     return NextResponse.redirect(new URL('/auth/signin', req.url));
//   }
//   return NextResponse.next();
// })
//
//


// Apply middleware to these routes
// export const config = {
//   matcher: ['/admin/:path*', '/profile/:path*']  // Protect /admin/* and /profile/* routes
// }
//
