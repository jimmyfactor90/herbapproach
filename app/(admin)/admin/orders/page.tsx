import { AdminService } from "@/features/admin/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { FaEye, FaSync } from "react-icons/fa";
import Link from "next/link";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import StatusUpdater from "@/features/admin/components/StatusUpdater";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateOrderStatusAction(orderId: string, status: string) {
  "use server";
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage() {
  const adminService = new AdminService();
  const orders = await adminService.getAllOrders();

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Orders</h2>
          <p className="text-muted small">Monitor and fulfill your customer orders</p>
        </div>
        <div className="d-flex gap-2">
           <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
              <FaSync /> Sync
           </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Order ID</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Customer</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Date</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Total</th>
                <th className="py-3 border-0 small text-uppercase text-muted text-center">Status</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 border-0">
                    <span className="fw-bold text-primary">#{order.orderNumber}</span>
                  </td>
                  <td className="py-4 border-0">
                    <div className="d-flex flex-column">
                       <span className="fw-500">{order.user.name}</span>
                       <span className="text-muted extra-small">{order.user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 border-0 small text-muted">
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="py-4 border-0 fw-bold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 border-0 text-center">
                    <StatusUpdater 
                       orderId={order.id} 
                       currentStatus={order.status} 
                       action={updateOrderStatusAction} 
                    />
                  </td>
                  <td className="px-4 py-4 border-0 text-end">
                    <Link href={`/admin/orders/${order.id}`} className="btn btn-light btn-sm border">
                      <FaEye size={12} className="me-1" /> View Details
                    </Link>
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
