import { ProductService } from "@/features/products/services/product.service";
import { formatPrice } from "@/lib/utils";
import { FaPlus, FaEdit, FaEye, FaLeaf } from "react-icons/fa";
import Link from "next/link";
import { deleteProductAction } from "@/features/products/actions/product.actions";
import DeleteButton from "@/features/admin/components/DeleteButton";

export default async function AdminProductsPage() {
  const productService = new ProductService();
  const { products } = await productService.getShopProducts({ pageSize: 50 });

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Products</h2>
          <p className="text-muted small">Manage your plant catalog and inventory</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-plant d-flex align-items-center gap-2">
          <FaPlus /> Add New Plant
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Plant</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Category</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Price</th>
                <th className="py-3 border-0 small text-uppercase text-muted text-center">Stock</th>
                <th className="py-3 border-0 small text-uppercase text-muted text-center">Status</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={product.mainImage} 
                        className="rounded border" 
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                        alt={product.name}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">{product.name}</h6>
                        <span className="text-muted extra-small">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                     <span className="badge bg-light text-dark border">{product.category.name}</span>
                  </td>
                  <td className="py-3 border-0 fw-500">
                     {formatPrice(product.price)}
                  </td>
                  <td className="py-3 border-0 text-center">
                     <span className={`fw-bold ${(product.inventory?.quantity ?? 0) < 10 ? 'text-danger' : ''}`}>
                        {product.inventory?.quantity || 0}
                     </span>
                  </td>
                  <td className="py-3 border-0 text-center">
                     {product.isActive ? (
                        <span className="badge bg-success-light text-success">Active</span>
                     ) : (
                        <span className="badge bg-light text-muted">Inactive</span>
                     )}
                  </td>
                  <td className="px-4 py-3 border-0 text-end">
                     <div className="d-flex justify-content-end gap-2">
                        <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-sm btn-outline-light border text-dark" title="View Public">
                           <FaEye size={12} />
                        </Link>
                        <Link href={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary" title="Edit">
                           <FaEdit size={12} />
                        </Link>
                        <DeleteButton id={product.id} action={deleteProductAction} />
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
