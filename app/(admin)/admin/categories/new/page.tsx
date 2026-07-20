import { CategoryRepository } from "@/features/products/repositories/category.repository";
import CategoryForm from "@/features/admin/components/CategoryForm";

export default async function NewCategoryPage() {
  const repo = new CategoryRepository();
  const categories = await repo.findAll();

  return (
    <div className="container-fluid py-4">
      <CategoryForm categories={categories} />
    </div>
  );
}
