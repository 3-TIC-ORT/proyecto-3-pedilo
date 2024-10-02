import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authConfig from "./auth.config"
import NextAuth from "next-auth"
// import { auth } from "@/auth";

const protectedRoutes = ["/admin", "/profile"];

const { auth } = NextAuth(authConfig)

export default auth((req) => {
 const session = !!req.auth;
  const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
  if (isProtected && (!session || !session)) {
    console.log("middleware: not Authenticated");
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  return NextResponse.next();
})




// Apply middleware to these routes
export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']  // Protect /admin/* and /profile/* routes
}

