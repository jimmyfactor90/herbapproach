"use client";

import { useState } from "react";
import AdminSidebar from "@/features/admin/components/AdminSidebar";
import { FaBars, FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
  };
}

export default function AdminDashboardLayout({ children, user }: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="admin-content">
        <header className="admin-topbar">
          <button className="btn btn-link link-dark d-lg-none" onClick={() => setSidebarOpen(true)}>
            <FaBars size={20} />
          </button>

          <div className="d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-1 border ms-2">
            <FaSearch className="text-muted small me-2" />
            <input 
              type="text" 
              className="form-control border-0 bg-transparent p-1 small" 
              placeholder="Search administration..." 
              style={{ width: '250px', fontSize: '0.85rem' }}
            />
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <button className="btn btn-link link-dark p-0 position-relative">
               <FaBell size={18} />
               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '0.5rem', padding: '0.25rem 0.35rem' }}>
                4
               </span>
            </button>
            <div className="border-start h-25 mx-1" style={{ width: '1px' }}></div>
            <div className="admin-user d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div className="fw-bold small" style={{ fontSize: '0.85rem', lineHeight: '1' }}>{user.name}</div>
                <div className="text-muted small" style={{ fontSize: '0.7rem' }}>{user.role}</div>
              </div>
              <FaUserCircle size={32} className="text-primary" />
            </div>
          </div>
        </header>

        <section className="admin-page">
          {children}
        </section>
      </main>
    </div>
  );
}
