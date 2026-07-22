import { ProductService } from "@/features/products/services/product.service";
import { CategoryService } from "@/features/products/services/category.service";
import ProductForm from "@/features/admin/components/ProductForm";
import { updateProductAction } from "@/features/products/actions/product.actions";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const productService = new ProductService();
  const categoryService = new CategoryService();
  
  // Need to find by ID, let's add a method or use prisma directly for admin
  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true }
  });

  if (!product) {
    notFound();
  }

  const categories = await categoryService.getCategoryTree();

  // Create update action with bound ID
  const boundUpdateAction = updateProductAction.bind(null, id);

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Edit Plant</h2>
        <p className="text-muted small">Update product details and stock</p>
      </div>

      <ProductForm 
        initialData={product}
        categories={categories} 
        action={boundUpdateAction}
      />
    </div>
  );
}
