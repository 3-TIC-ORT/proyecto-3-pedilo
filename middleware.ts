import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from "@/Utils/Auth";
 
const protectedRoutes = ["/","/menu"];

// This function can be marked `async` if using `await` inside
export default function middleware(req: NextRequest) {
  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(absoluteURL.toString(), request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/about'] 
}