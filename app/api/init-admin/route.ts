import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminEmail = "business.shivam2026@gmail.com";
    const adminPassword = "Shivam@123";

    // 1. Delete existing if any (to avoid conflict)
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.deleteMany({ where: { email: adminEmail } });

    // 2. Create user through Better Auth API (This handles hashing correctly!)
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Shivam SuperAdmin",
      }
    });

    // 3. Update the role to SUPER_ADMIN (Default is CUSTOMER)
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "SUPER_ADMIN", emailVerified: true }
    });

    return NextResponse.json({ 
      success: true, 
      message: "SuperAdmin created successfully with correct hashing!",
      email: adminEmail
    });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
