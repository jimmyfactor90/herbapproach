import { AdminService } from "@/features/admin/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { FaShoppingBag, FaUsers, FaLeaf, FaChartLine, FaClock, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const adminService = new AdminService();
  const data = await adminService.getDashboardStats();
  const recentOrders = await adminService.getRecentOrders();

  const statCards = [
    { label: "Total Revenue", value: formatPrice(data.stats.totalSales), icon: FaChartLine, color: "primary", trend: "+12.5%" },
    { label: "New Orders", value: data.stats.totalOrders, icon: FaShoppingBag, color: "info", trend: "+8.2%" },
    { label: "Total Users", value: data.stats.totalUsers, icon: FaUsers, color: "success", trend: "+5.4%" },
    { label: "Active Products", value: data.stats.totalProducts, icon: FaLeaf, color: "secondary", trend: "0%" },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Overview</h2>
          <p className="text-muted small">Welcome back to your dashboard</p>
        </div>
        <div className="d-flex gap-2">
           <button className="btn btn-outline-primary btn-sm">Export Report</button>
           <button className="btn btn-plant btn-sm">Refresh Data</button>
        </div>
      </div>

      {/* Quick Alerts */}
      {(data.stats.pendingOrders > 0 || data.stats.lowStockProducts > 0) && (
        <div className="row g-3 mb-4">
           {data.stats.pendingOrders > 0 && (
             <div className="col-md-6">
                <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-3 mb-0">
                   <div className="bg-white p-2 rounded-circle text-warning shadow-sm"><FaClock /></div>
                   <div>
                      <h6 className="fw-bold mb-0">{data.stats.pendingOrders} Pending Orders</h6>
                      <Link href="/admin/orders?status=PENDING" className="small text-decoration-none">Review orders now &rarr;</Link>
                   </div>
                </div>
             </div>
           )}
           {data.stats.lowStockProducts > 0 && (
             <div className="col-md-6">
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-3 mb-0">
                   <div className="bg-white p-2 rounded-circle text-danger shadow-sm"><FaExclamationTriangle /></div>
                   <div>
                      <h6 className="fw-bold mb-0">{data.stats.lowStockProducts} Low Stock Alerts</h6>
                      <Link href="/admin/inventory" className="small text-decoration-none">Update inventory &rarr;</Link>
                   </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, i) => (
          <div key={i} className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`bg-${stat.color}-light p-3 rounded-lg text-${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className={`badge ${stat.trend.startsWith('+') ? 'bg-success-light text-success' : 'bg-light text-muted'}`}>
                    {stat.trend}
                  </span>
                </div>
                <h6 className="text-muted small fw-bold text-uppercase mb-1">{stat.label}</h6>
                <h3 className="fw-bold m-0 text-dark">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-xl-8">
           <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                 <h5 className="fw-bold m-0">Recent Orders</h5>
                 <Link href="/admin/orders" className="btn btn-link link-primary p-0 text-decoration-none small">View All</Link>
              </div>
              <div className="card-body p-0">
                 <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                       <thead className="bg-light">
                          <tr>
                             <th className="px-4 py-3 border-0 small text-uppercase text-muted">Order ID</th>
                             <th className="py-3 border-0 small text-uppercase text-muted">Customer</th>
                             <th className="py-3 border-0 small text-uppercase text-muted text-center">Status</th>
                             <th className="py-3 border-0 small text-uppercase text-muted">Total</th>
                             <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Action</th>
                          </tr>
                       </thead>
                       <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id}>
                               <td className="px-4 py-4 border-0 h6 mb-0 fw-bold">#{order.orderNumber}</td>
                               <td className="py-4 border-0">
                                  <div className="d-flex align-items-center gap-2">
                                     <div className="bg-light rounded-circle p-2 text-primary small fw-bold">
                                        {order.user.name.charAt(0)}
                                     </div>
                                     <span className="small">{order.user.name}</span>
                                  </div>
                               </td>
                               <td className="py-4 border-0 text-center">
                                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                     {ORDER_STATUS_LABELS[order.status]}
                                  </span>
                               </td>
                               <td className="py-4 border-0 fw-bold">{formatPrice(order.total)}</td>
                               <td className="px-4 py-4 border-0 text-end">
                                  <Link href={`/admin/orders/${order.id}`} className="btn btn-light btn-sm border">Details</Link>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>

        {/* Sales Chart Helper (Placeholder) */}
        <div className="col-xl-4">
           <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-header bg-white border-0 py-4 px-4">
                 <h5 className="fw-bold m-0">Sales Analytics</h5>
              </div>
              <div className="card-body px-4">
                 <div className="d-flex flex-column gap-3 mb-4">
                    {data.salesData.slice(-4).map((entry, i) => (
                       <div key={i}>
                          <div className="d-flex justify-content-between mb-1 small fw-bold">
                             <span>{entry.month}</span>
                             <span>{formatPrice(entry.sales)}</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                             <div className="progress-bar bg-primary" style={{ width: `${(entry.sales / 8000) * 100}%` }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="alert alert-primary-light border-0 small p-3 rounded-lg">
                    <h6 className="fw-bold small mb-1">Insights</h6>
                    <p className="m-0 text-muted">Sales are up 15% compared to last month. Highest selling category is Cannabis Flowers.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
