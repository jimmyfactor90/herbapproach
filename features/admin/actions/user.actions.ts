"use server";

import { AdminService } from "../services/admin.service";
import { requireAdmin } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateUserRoleAction(userId: string, targetRole: string) {
  await requireAdmin();
  const adminService = new AdminService();
  await adminService.updateUserRole(userId, targetRole);
  revalidatePath("/admin/users");
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();
  const adminService = new AdminService();
  await adminService.deleteUser(userId);
  revalidatePath("/admin/users");
}

export async function deleteAllUsersAndCreateSuperuserAction() {
  await requireAdmin();
  
  // Danger zone: Delete all users except current admin
  // For safety, let's just implement a cleanup script the user can run via CLI
  // but if they insist on a button, here it is (careful!)
  
  // 1. Get current admin to avoid self-deletion
  // const session = await getServerSession(); 
  // ... better to do this in a script
  return { error: "Please use the CLI script for global user wipes for safety." };
}
