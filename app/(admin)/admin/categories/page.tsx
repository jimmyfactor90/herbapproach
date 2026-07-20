import { CategoryRepository } from "@/features/products/repositories/category.repository";
import { format } from "date-fns";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

async function deleteCategoryAction(id: string) {
  "use server";
  await prisma.category.delete({ where: { id } });
  revalidateTag("categories", "max");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export default async function AdminCategoriesPage() {
  const repo = new CategoryRepository();
  const categories = await repo.findAll();

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Categories</h2>
          <p className="text-muted small">Organize your plant catalog</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-plant d-flex align-items-center gap-2">
          <FaPlus /> Add New Category
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Category</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Products</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Created At</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat: any) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                      ) : (
                        <div className="bg-light rounded border d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <span className="small text-muted">{cat.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="mb-0 fw-bold">{cat.name}</h6>
                          {cat.parentId && <span className="badge bg-secondary-light text-secondary extra-small">Sub-category</span>}
                        </div>
                        <span className="text-muted extra-small">{cat.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    {cat._count?.products || 0} Products
                  </td>
                  <td className="py-3 border-0">
                    {format(new Date(cat.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-3 border-0 text-end">
                    <div className="d-flex justify-content-end gap-2">
                       <Link href={`/admin/categories/${cat.id}`} className="btn btn-sm btn-outline-primary"><FaEdit size={12} /></Link>
                       <DeleteButton id={cat.id} action={deleteCategoryAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
