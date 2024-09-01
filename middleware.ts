import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from "@/utils/auth";

const protectedRoutes = ["/admin*", "/profile*"];

export async function middleware(req: NextRequest) {
  console.log("middleware: start");

  // Check if the user is authenticated
  const authResult = await isAuthenticated(req);
  console.log(authResult.isAuthenticated);

  if (!authResult.isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    console.log("middleware: not Authenticated");
    const loginUrl = new URL('/auth/signin', req.url);  // Specify your login page or authentication route
    return NextResponse.redirect(loginUrl);
  }

  // Continue with the request if authenticated
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/', '/menu']
// }
//
