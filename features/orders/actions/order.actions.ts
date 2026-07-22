"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";
import { generateOrderNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  items: any[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    email: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  paymentMethod: string;
}) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const orderNumber = generateOrderNumber();

  return await prisma.$transaction(async (tx) => {
    // 1. Create the address
    const address = await tx.address.create({
      data: {
        userId: session.user.id,
        label: "Shipping",
        fullName: data.shippingAddress.fullName,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        phone: data.shippingAddress.phone,
      },
    });

    // 2. Create the order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: "PENDING",
        subtotal: data.pricing.subtotal,
        shipping: data.pricing.shipping,
        total: data.pricing.total,
        shippingAddressId: address.id,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            weight: item.weight || null,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
        payment: {
          create: {
            provider: data.paymentMethod,
            amount: data.pricing.total,
            status: "PENDING",
          },
        },
      },
    });

    // 3. Update inventory (simple decrease)
    for (const item of data.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/orders");

    return order;
  });
}

export async function updatePaymentStatus(orderId: string, providerId: string, status: string) {
  return await prisma.payment.update({
    where: { orderId },
    data: {
      providerId,
      status: status === "captured" ? "COMPLETED" : "FAILED",
    },
  });
}
