import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.AMETHYST_DATABASE_URL}`;

async function main() {
  console.log("Connecting using connection string:", connectionString.substring(0, 30) + "...");
  
  // Directly using the initialization style from the user request
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Querying users...");
    const users = await prisma.user.findMany();
    console.log("Connection successful! Current users count:", users.length);
  } catch (error) {
    console.error("Connection failed with error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
