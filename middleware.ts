import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

// Define route permissions for each role
const roleRoutes = {
  unauthenticated: ['/', '/landing', '/menu', '/login'],
  user: ['/', '/landing', '/menu', '/cart', '/orders', '/profile', '/tables'], // default role
  waiter: ['/', '/menu', '/cart', '/orders', '/profile', '/tables', '/calls'],
  chef: ['/', '/orders', '/profile']
};

export async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;

  // Allow access to unauthenticated routes regardless of session status
  if (roleRoutes.unauthenticated.includes(path)) {
    return NextResponse.next();
  }

  // Redirect to login if no session exists
  if (!session || !session.user) {
    console.log("middleware: not Authenticated");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get user's role from session, default to 'user' if not specified
  const userRole = session.user.role || 'user';

  // Check if user has permission to access the requested path
  const hasAccess = roleRoutes[userRole as keyof typeof roleRoutes]?.includes(path);

  if (!hasAccess) {
    // Redirect to home page or show forbidden error
    console.log(`middleware: unauthorized access to ${path} for role ${userRole}`);
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except API routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
