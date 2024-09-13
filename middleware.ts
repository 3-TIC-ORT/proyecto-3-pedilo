// export { auth as middleware } from "@/auth"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

const protectedRoutes = ["/admin", "/profile"];

export async function middleware(req: NextRequest) {
  console.log("middleware: start");

  // Check if the user is authenticated
  const session = await auth();

  // Loop through the protected routes to check for any match
  const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // Check if the route is protected and if there's no session or no user
  if (isProtected && (!session || !session.user)) {
    console.log("middleware: not Authenticated");

    // Redirect to the login page if not authenticated
    const loginUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Continue with the request if authenticated
  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']  // Protect /admin/* and /profile/* routes
}

