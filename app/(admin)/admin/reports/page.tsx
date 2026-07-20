import { getSalesReport } from "@/features/admin/services/report.service";
import SalesChart from "@/features/admin/components/SalesChart";
import { formatPrice } from "@/lib/utils";
import { FaMoneyBillWave, FaShoppingCart, FaUserTag, FaArrowUp, FaChartLine, FaLeaf } from "react-icons/fa";
import { format } from "date-fns";

export default async function SalesReportPage() {
  const reports = await getSalesReport(30);

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Sales Analytics</h2>
          <p className="text-muted small">Comprehensive breakdown of your revenue and trends</p>
        </div>
        <div className="btn-group">
            <button className="btn btn-outline-secondary btn-sm active">Last 30 Days</button>
            <button className="btn btn-outline-secondary btn-sm">This Month</button>
            <button className="btn btn-outline-secondary btn-sm">Year to Date</button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-lg p-4 h-100 bg-primary-dark text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-white p-3 rounded-lg text-primary shadow-sm">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <span className="badge bg-success-light text-success"><FaArrowUp /> 12%</span>
                </div>
                <h6 className="text-white-50 small uppercase tracking-wider mb-2">Total Revenue</h6>
                <h2 className="display-6 fw-bold mb-0">{formatPrice(reports.totalRevenue)}</h2>
            </div>
        </div>
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-lg p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary-light p-3 rounded-lg text-primary">
                        <FaShoppingCart size={24} />
                    </div>
                </div>
                <h6 className="text-muted small uppercase tracking-wider mb-2">Sales Count</h6>
                <h2 className="display-6 fw-bold mb-0">{reports.totalOrders} Orders</h2>
            </div>
        </div>
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-lg p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-secondary-light p-3 rounded-lg text-secondary">
                        <FaUserTag size={24} />
                    </div>
                </div>
                <h6 className="text-muted small uppercase tracking-wider mb-2">Avg. Order Value</h6>
                <h2 className="display-6 fw-bold mb-0">{formatPrice(reports.avgOrderValue)}</h2>
            </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-lg h-100">
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0"><FaChartLine className="text-muted me-2" /> Revenue Trend</h5>
                </div>
                <div className="card-body px-4 pb-4">
                   <SalesChart data={reports.salesByDay} />
                </div>
            </div>
        </div>
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-lg h-100">
                <div className="card-header bg-white border-0 py-4 px-4">
                    <h5 className="fw-bold m-0"><FaLeaf className="text-muted me-2" /> Top Selling Strains</h5>
                </div>
                <div className="card-body px-4 pb-4">
                    <div className="d-flex flex-column gap-4">
                        {reports.topProducts.map((p, i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="small fw-bold text-muted">{i+1}.</div>
                                    <h6 className="mb-0 fw-bold">{p.name}</h6>
                                </div>
                                <div className="fw-bold text-primary">{formatPrice(p.total)}</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-light w-100 mt-5 py-2 small fw-bold">View Full Inventory Stats</button>
                </div>
            </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
        <div className="card-header bg-white border-0 py-4 px-4">
            <h5 className="fw-bold m-0">Recent Successful Sales</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted">Order ID</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Customer</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Items</th>
                <th className="py-3 border-0 small text-uppercase text-muted">Amount</th>
                <th className="px-4 py-3 border-0 small text-uppercase text-muted text-end">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 border-0 fw-bold">#{order.orderNumber}</td>
                  <td className="py-3 border-0 text-muted">Customer Order</td>
                  <td className="py-3 border-0">{order.items.length} Products</td>
                  <td className="py-3 border-0 fw-bold text-success">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 border-0 text-end text-muted small">
                    {format(new Date(order.createdAt), "MMM dd, hh:mm a")}
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
