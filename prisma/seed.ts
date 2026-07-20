import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Seeding Herb Approach-style Dispensary database...");

  // 0. Superadmin
  const adminEmail = "business.shivam2026@gmail.com";
  const hashedPassword = await bcrypt.hash("Shivam@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN" },
    create: {
      name: "Shivam SuperAdmin",
      email: adminEmail,
      role: "SUPER_ADMIN",
      emailVerified: true,
      accounts: {
        create: {
          accountId: adminEmail,
          providerId: "credential",
          password: hashedPassword,
        }
      }
    },
  });

  console.log(`✅ Superadmin created: ${admin.email}`);

  // 1. Categories
  const categories = [
    {
      name: "Flowers",
      slug: "flowers",
      description: "Premium AAAA+ Grade Cannabis Flowers. Indica, Sativa, and Hybrid strains.",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1000",
    },
    {
      name: "Concentrates",
      slug: "concentrates",
      description: "High potency Shatter, Budder, Live Resin, and Diamonds.",
      image: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1000",
    },
    {
      name: "Edibles",
      slug: "edibles",
      description: "Delicious THC and CBD infused Gummies, Chocolates, and Baked Goods.",
      image: "https://images.unsplash.com/photo-1590333746438-2fe1941df871?q=80&w=1000",
    },
    {
      name: "Vapes",
      slug: "vapes",
      description: "Premium Distillate cartridges and Disposable vaporizers.",
      image: "https://images.unsplash.com/photo-1598911515765-75744ecfb60c?q=80&w=1000",
    },
    {
      name: "CBD",
      slug: "cbd",
      description: "Non-psychoactive relief. Oils, Capsules, and Topicals.",
      image: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const flowersCat = await prisma.category.findUnique({ where: { slug: "flowers" } });
  const ediblesCat = await prisma.category.findUnique({ where: { slug: "edibles" } });

  // 2. Products
  const products = [
    {
      name: "Cereal Milk (AAAA+)",
      slug: "cereal-milk-aaaa",
      description: "A potent hybrid strain cross of Y Life and Snowman. It has a loud flavor with a sweet milk and ice cream nose that will keep you dipping back into your stash.",
      price: 2499,
      comparePrice: 3200,
      sku: "FLWR-CRM-001",
      mainImage: "https://images.pexels.com/photos/5650024/pexels-photo-5650024.jpeg?auto=compress&cs=tinysrgb&w=1000",
      featured: true,
      careLevel: "MEDIUM", // Reusing this field for "Difficulty" or similar
      sunlight: "INDIRECT",
      waterFrequency: "Hybrid - 50% Indica / 50% Sativa",
      petFriendly: false,
      indoorOutdoor: "INDOOR",
      size: "MEDIUM",
      categoryId: flowersCat!.id,
    },
    {
      name: "Blueberry Haze (AAA)",
      slug: "blueberry-haze-aaa",
      description: "Blueberry Haze is a sativa dominant hybrid strain created through crossing the classic Blueberry X Secret Haze strains.",
      price: 1800,
      comparePrice: 2200,
      sku: "FLWR-BBH-001",
      mainImage: "https://images.pexels.com/photos/5650017/pexels-photo-5650017.jpeg?auto=compress&cs=tinysrgb&w=1000",
      featured: true,
      careLevel: "EASY",
      sunlight: "FULL_SUN",
      waterFrequency: "Sativa Dominant",
      petFriendly: false,
      indoorOutdoor: "INDOOR",
      size: "LARGE",
      categoryId: flowersCat!.id,
    },
    {
      name: "THC Infused Gummies (500mg)",
      slug: "thc-infused-gummies-500mg",
      description: "Bursting with natural fruit flavors, these gummies offer a precise dose of high-quality THC in every bite.",
      price: 3500,
      comparePrice: 4200,
      sku: "EDBL-GUM-001",
      mainImage: "https://images.pexels.com/photos/5469037/pexels-photo-5469037.jpeg?auto=compress&cs=tinysrgb&w=1000",
      featured: false,
      careLevel: "EASY",
      sunlight: "LOW_LIGHT",
      waterFrequency: "Mixed Fruit Pack",
      petFriendly: false,
      indoorOutdoor: "INDOOR",
      size: "SMALL",
      categoryId: ediblesCat!.id,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: {
        ...prod,
        inventory: {
          create: {
            quantity: 100,
            lowStockThreshold: 20,
          }
        }
      }
    });
  }

  console.log("✅ Herb Approach Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
