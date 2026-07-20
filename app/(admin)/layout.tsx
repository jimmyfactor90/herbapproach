import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import AdminDashboardLayout from "@/features/admin/components/AdminDashboardLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get session on the server
  const session = await getServerSession();

  // 2. Check if logged in
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  // 3. Check for admin/superadmin role
  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    // Redirect normal users to home if they try to access /admin
    redirect("/");
  }

  return (
    <AdminDashboardLayout 
      user={{ 
        name: session.user.name, 
        role: userRole === "SUPER_ADMIN" ? "Super Admin" : "Administrator" 
      }}
    >
      {children}
    </AdminDashboardLayout>
  );
}
