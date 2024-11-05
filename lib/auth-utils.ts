// lib/auth-utils.ts
import { redirect } from 'next/navigation';
import { auth } from "@/auth";

// Centralized array of all possible routes
const allRoutes = [
  '/', '/landing', '/menu', '/login', '/cart', '/orders', '/profile', '/tables', '/calls'
] as const;

// Define Path type based on allRoutes
export type Path = typeof allRoutes[number];

const roleRoutes = {
  unauthenticated: ['/', '/landing', '/menu', '/login'] as Path[],
  user: ['/', '/landing', '/menu', '/cart', '/orders', '/profile', '/tables'] as Path[],
  waiter: ['/', '/menu', '/cart', '/orders', '/profile', '/tables', '/calls'] as Path[],
  chef: ['/', '/orders', '/profile'] as Path[]
} as const;

type Role = keyof typeof roleRoutes;

export async function checkAccess(path: Path) {
  const session = await auth();

  // Check if it's an unauthenticated route
  if (roleRoutes.unauthenticated.includes(path)) {
    return true;
  }

  // If no session, redirect to login
  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user.role as Role) || 'user';

  // Check if the current path is allowed for the user's role
  const hasAccess = roleRoutes[userRole].some(route => {
    if (route === path) return true;
    if (route !== '/' && path.startsWith(route + '/')) return true;
    return false;
  });

  if (!hasAccess) {
    redirect('/');
  }

  return true;
}

