import { CategoryRepository } from "@/features/products/repositories/category.repository";
import CategoryForm from "@/features/admin/components/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = new CategoryRepository();
  const [category, allCategories] = await Promise.all([
    repo.findById(id),
    repo.findAll()
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="container-fluid py-4">
      <CategoryForm initialData={category} categories={allCategories} />
    </div>
  );
}
