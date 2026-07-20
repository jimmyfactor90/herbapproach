import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "better-auth/crypto"; // Hypothetical or use standard bcrypt if needed

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting fresh user setup...");

  try {
    console.log("🧹 Clearing related data...");
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.address.deleteMany();
    
    // 2. Delete all users
    await prisma.user.deleteMany();
    console.log("✅ All existing users and data deleted.");

    // 3. Create Super Admin
    const superUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@example.com",
        role: "ADMIN",
      }
    });

    console.log(`✅ Super Admin created: ${superUser.email}`);
    console.log("👉 You can now register with this email to access the admin panel.");
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
