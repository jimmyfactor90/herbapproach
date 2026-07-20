"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { 
  FaUser, FaShoppingBag, FaMapMarkerAlt, FaLock, 
  FaSignOutAlt, FaLeaf, FaChevronRight, FaBoxOpen 
} from "react-icons/fa";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?callbackUrl=/profile");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const user = session.user;

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "orders", label: "My Orders", icon: FaShoppingBag },
    { id: "addresses", label: "Addresses", icon: FaMapMarkerAlt },
    { id: "security", label: "Security", icon: FaLock },
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-lg overflow-hidden mb-4">
              <div className="card-body p-4 text-center bg-primary-dark text-white">
                <div className="bg-white p-3 rounded-circle d-inline-flex text-primary mb-3">
                  <FaUser size={32} />
                </div>
                <h5 className="fw-bold mb-0">{user.name}</h5>
                <p className="extra-small opacity-75 mb-0 text-uppercase tracking-wider">Verified Member</p>
              </div>
              <div className="list-group list-group-flush border-0">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 px-4 ${
                      activeTab === item.id ? "bg-primary-light text-primary fw-bold border-start border-primary border-4" : ""
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    <FaChevronRight className="ms-auto extra-small opacity-25" />
                  </button>
                ))}
                <button
                  onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
                  className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 px-4 text-danger"
                >
                  <FaSignOutAlt size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <div className="alert alert-secondary border-0 rounded-lg small">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaLeaf className="text-secondary" />
                <span className="fw-bold">Herb Points</span>
              </div>
              <p className="mb-0 text-muted">You have <strong>450 points</strong>. Redeem them for discounts at checkout!</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-lg min-vh-75">
              <div className="card-body p-4 p-md-5">
                
                {activeTab === "overview" && (
                  <div className="animate-fade-in">
                    <h3 className="fw-bold mb-4">Account Overview</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="p-3 rounded-lg border bg-light">
                          <label className="extra-small text-muted text-uppercase fw-bold mb-1 d-block">Full Name</label>
                          <div className="fw-bold">{user.name}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 rounded-lg border bg-light">
                          <label className="extra-small text-muted text-uppercase fw-bold mb-1 d-block">Email Address</label>
                          <div className="fw-bold">{user.email}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 rounded-lg border bg-light">
                          <label className="extra-small text-muted text-uppercase fw-bold mb-1 d-block">Phone Number</label>
                          <div className="fw-bold">{(user as any).phone || "Not provided"}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 rounded-lg border bg-light">
                          <label className="extra-small text-muted text-uppercase fw-bold mb-1 d-block">Member Since</label>
                          <div className="fw-bold">June 2026</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h5 className="fw-bold mb-3">Recent Activity</h5>
                      <div className="table-responsive">
                         <table className="table table-hover align-middle">
                            <thead className="bg-light">
                               <tr>
                                  <th className="small border-0">Action</th>
                                  <th className="small border-0">Date</th>
                                  <th className="small border-0 text-end">Status</th>
                               </tr>
                            </thead>
                            <tbody>
                               <tr>
                                  <td className="border-0">Account Login</td>
                                  <td className="border-0 text-muted small">Today, 10:45 AM</td>
                                  <td className="border-0 text-end"><span className="badge bg-success-light text-success">Success</span></td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="animate-fade-in text-center py-5">
                    <div className="mb-4 text-muted opacity-25">
                      <FaBoxOpen size={80} />
                    </div>
                    <h4 className="fw-bold">No orders yet</h4>
                    <p className="text-muted mb-4 text-center mx-auto" style={{ maxWidth: '400px' }}>
                      Items you purchase will show up here. Start exploring our premium collection today!
                    </p>
                    <Link href="/shop" className="btn btn-plant btn-lg px-5">Start Shopping</Link>
                  </div>
                )}

                {activeTab === "addresses" && (
                  <div className="animate-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="fw-bold m-0">My Addresses</h3>
                      <button className="btn btn-link text-primary text-decoration-none fw-bold p-0">+ Add New</button>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-4 rounded-lg border border-primary border-2 bg-primary-light-alpha position-relative">
                          <span className="badge bg-primary position-absolute top-0 end-0 m-3">Default</span>
                          <h6 className="fw-bold mb-2">Home</h6>
                          <p className="small text-muted mb-3 m-0">
                            {user.name}<br/>
                            123 Green Lane, Sector 45<br/>
                            Chandigarh, 160047<br/>
                            India
                          </p>
                          <div className="d-flex gap-3">
                             <button className="btn btn-link link-dark p-0 small text-decoration-none">Edit</button>
                             <button className="btn btn-link link-danger p-0 small text-decoration-none">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="animate-fade-in">
                    <h3 className="fw-bold mb-4">Security Settings</h3>
                    <div className="d-flex flex-column gap-4">
                      <div className="p-4 rounded-lg bg-light border">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="fw-bold mb-1">Change Password</h6>
                            <p className="small text-muted m-0">Update your account password regularly for better security.</p>
                          </div>
                          <Link href="/forgot-password" className="btn btn-outline-dark btn-sm px-4 rounded-pill">Update</Link>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-light border">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="fw-bold mb-1">Two-Factor Authentication</h6>
                            <p className="small text-muted m-0 text-success fw-bold">Enabled</p>
                          </div>
                          <button className="btn btn-outline-danger px-4 rounded-pill">Disable</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
