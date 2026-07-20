import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the current session server-side.
 * Use in Server Components and Server Actions.
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Require authentication. Throws if not logged in.
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

/**
 * Check if current user has a specific role.
 */
export async function requireRole(role: string | string[]) {
  const session = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  const userRole = (session.user as any).role || "CUSTOMER";

  if (!roles.includes(userRole)) {
    throw new Error(`Access denied. Required role: ${roles.join(" or ")}`);
  }
  return session;
}

/**
 * Check if user is admin or super admin.
 */
export async function requireAdmin() {
  return requireRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Check if user is super admin.
 */
export async function requireSuperAdmin() {
  return requireRole("SUPER_ADMIN");
}
