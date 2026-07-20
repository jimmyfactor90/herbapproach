import { CategoryService } from "@/features/products/services/category.service";
import ProductForm from "@/features/admin/components/ProductForm";
import { createProductAction } from "@/features/products/actions/product.actions";
import { FaPlus } from "react-icons/fa";

export default async function NewProductPage() {
  const categoryService = new CategoryService();
  const categories = await categoryService.getAllCategories();

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Add New Plant</h2>
        <p className="text-muted small">Create a new listing in your catalog</p>
      </div>

      <ProductForm 
        categories={categories} 
        action={createProductAction}
      />
    </div>
  );
}
