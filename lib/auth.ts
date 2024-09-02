import { NextRequest } from 'next/server';
import { getToken, JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";

export async function isAuthenticated(req: NextRequest) {
  console.log("isAuthenticated: start");

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not set");
    return { isAuthenticated: false, user: null };
  }

  try {
    // Convert NextRequest to a standard IncomingMessage
    const token = await getToken({
      req: {
        headers: Object.fromEntries(req.headers),
        cookies: Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value]))
      } as any,
      secret: secret
    });

    if (token) {
      console.log("authenticated");
      return {
        isAuthenticated: true,
        user: token as JWT,  // Use the JWT type from next-auth/jwt
      };
    }

    console.log("not authenticated");
    return {
      isAuthenticated: false,
      user: null,
    };
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}

export async function getSession(req: NextRequest, res: Response) {
  // For API Routes
  if (req.headers.get("x-invoke-path")?.startsWith("/api")) {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      return { user: token };
    }
    return null;
  }

  // For Server-Side Rendering
  return getServerSession();
}
