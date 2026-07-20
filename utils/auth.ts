import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * A utility to check if the user is an admin from the session.
 */
export const isAdmin = (user: any) => {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
};

/**
 * A utility to check if the user is a super admin.
 */
export const isSuperAdmin = (user: any) => {
  return user?.role === "SUPER_ADMIN";
};

/**
 * Formats a user's display name or returns 'Guest'.
 */
export const getDisplayName = (user: any) => {
  return user?.name || user?.email?.split("@")[0] || "Guest";
};
