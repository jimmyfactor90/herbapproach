import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, image, parentId } = body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
      },
    });

    revalidateTag("categories", "max");
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, description, image, parentId } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
      },
    });

    revalidateTag("categories", "max");
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("[CATEGORIES_PUT]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
