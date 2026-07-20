import { prisma } from "@/lib/prisma";
import StockEditor from "@/features/admin/components/StockEditor";
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaLeaf } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: {
      inventory: true,
      category: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Inventory Management</h2>
        <p className="text-muted small">Monitor and update stock levels for your entire collection</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-success-light p-3 rounded-circle text-success"><FaCheckCircle size={24} /></div>
                <div>
                    <h3 className="fw-bold mb-0">{products.filter(p => (p.inventory?.quantity || 0) > 10).length}</h3>
                    <p className="extra-small text-muted mb-0 uppercase fw-bold">In Stock</p>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-warning-light p-3 rounded-circle text-warning"><FaExclamationTriangle size={24} /></div>
                <div>
                    <h3 className="fw-bold mb-0">{products.filter(p => (p.inventory?.quantity || 0) <= 5 && (p.inventory?.quantity || 0) > 0).length}</h3>
                    <p className="extra-small text-muted mb-0 uppercase fw-bold">Low Stock (≤ 5)</p>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-danger-light p-3 rounded-circle text-danger"><FaTimesCircle size={24} /></div>
                <div>
                    <h3 className="fw-bold mb-0">{products.filter(p => (p.inventory?.quantity || 0) === 0).length}</h3>
                    <p className="extra-small text-muted mb-0 uppercase fw-bold">Out of Stock</p>
                </div>
            </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Product</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Category</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Status</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Current Stock</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Quick Adjust</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = product.inventory?.quantity || 0;
                let status = { label: "In Stock", color: "success" };
                if (stock === 0) status = { label: "Out of Stock", color: "danger" };
                else if (stock <= 5) status = { label: "Low Stock", color: "warning" };

                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <img src={product.mainImage} className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        <div>
                          <h6 className="mb-0 fw-bold">{product.name}</h6>
                          <span className="text-muted extra-small">{product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 border-0">
                      <span className="badge bg-light text-dark border fw-normal">{product.category.name}</span>
                    </td>
                    <td className="py-3 border-0">
                      <span className={cn("badge", `bg-${status.color}-light`, `text-${status.color}`, "px-3 py-2 rounded-pill")}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 border-0">
                       <span className={cn("fw-bold h6 mb-0", stock <= 5 ? "text-danger" : "text-dark")}>
                         {stock} Units
                       </span>
                    </td>
                    <td className="px-4 py-3 border-0 text-end">
                       <div className="d-flex justify-content-end">
                         <StockEditor productId={product.id} initialQuantity={stock} />
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
