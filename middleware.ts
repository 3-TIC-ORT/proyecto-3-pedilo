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

// Function to check if a path has access to a base route
const hasRouteAccess = (userRoutes: string[], currentPath: string): boolean => {
  return userRoutes.some(route => {
    // Exact match
    if (route === currentPath) return true;
    // Check if currentPath is a subroute of any allowed route
    // e.g., '/profile/settings' should be allowed if '/profile' is allowed
    if (route !== '/' && currentPath.startsWith(route + '/')) return true;
    return false;
  });
};
export async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;


  // Allow access to unauthenticated routes regardless of session status
  if (hasRouteAccess(roleRoutes.unauthenticated, path)) {
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
  const hasAccess = hasRouteAccess(roleRoutes[userRole as keyof typeof roleRoutes], path);

  if (!hasAccess) {
    // Redirect to home page or show forbidden error
    console.log(`middleware: unauthorized access to ${path} for role ${userRole}`);
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except API routes, static files, and media
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - media/image (media files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|media|image|favicon.ico).*)',
  ],
  runtime: 'edge'
};
