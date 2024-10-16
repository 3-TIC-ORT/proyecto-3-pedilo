import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

const protectedRoutes = {
  user: ["/profile", "/orders", "/tables", "/api/assign_table", "/cart"],
  waiter: ["/profile", "/tables", "/calls"],
  chef: ["/chef", "/kitchen"],
  admin: ["/profile", "/dashboard"]
};

export async function middleware(req: NextRequest) {
  const session = await auth();
  
  if (!session || !session.user) {
    console.log("middleware: not Authenticated");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = session.user.role; // Assuming the user object has a 'role' property

  for (const [role, routes] of Object.entries(protectedRoutes)) {
    if (routes.some(route => req.nextUrl.pathname.startsWith(route))) {
      if (userRole !== role) {
        console.log(`middleware: Unauthorized access. Required role: ${role}, User role: ${userRole}`);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: [
    '/user/:path*', 
    '/profile/:path*',
    '/waiter/:path*', 
    '/orders/:path*',
    '/chef/:path*', 
    '/kitchen/:path*',
    '/admin/:path*', 
    '/dashboard/:path*'
  ]
}