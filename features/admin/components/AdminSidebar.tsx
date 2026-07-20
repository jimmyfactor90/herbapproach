"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaChartPie, FaLeaf, FaTags, FaShoppingBasket, 
  FaUsers, FaTicketAlt, FaWarehouse, FaBell, 
  FaChartBar, FaUserCircle, FaSignOutAlt, FaBars
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

export default function AdminSidebar({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: "/admin", icon: FaChartPie },
        { name: "Orders", href: "/admin/orders", icon: FaShoppingBasket, badge: "5" },
      ]
    },
    {
      title: "Catalog",
      items: [
        { name: "Products", href: "/admin/products", icon: FaLeaf },
        { name: "Categories", href: "/admin/categories", icon: FaTags },
        { name: "Inventory", href: "/admin/inventory", icon: FaWarehouse },
      ]
    },
    {
      title: "Marketing",
      items: [
        { name: "Hero Slider", href: "/admin/hero", icon: FaChartBar },
        { name: "Coupons", href: "/admin/coupons", icon: FaTicketAlt },
      ]
    },
    {
      title: "Customer",
      items: [
        { name: "Users", href: "/admin/users", icon: FaUsers },
        { name: "Reviews", href: "/admin/reviews", icon: FaBell },
      ]
    },
    {
      title: "Reports",
      items: [
        { name: "Sales Reports", href: "/admin/reports", icon: FaChartBar },
      ]
    }
  ];

  return (
    <aside className={cn("admin-sidebar", isOpen && "show")}>
      <div className="sidebar-header d-flex justify-content-between align-items-center">
        <Link href="/admin" className="sidebar-brand">
          <FaLeaf className="text-secondary" /> <span>Herb Approach Admin</span>
        </Link>
        <button className="btn btn-link text-white d-lg-none" onClick={toggle}>
           <FaBars />
        </button>
      </div>

      <div className="sidebar-nav">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="nav-section-title">{group.title}</div>
            <div className="nav-list">
              {group.items.map((item) => (
                <div key={item.href} className="nav-item">
                  <Link 
                    href={item.href} 
                    className={cn("nav-link", pathname === item.href && "active")}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                    {item.badge && <span className="badge-nav">{item.badge}</span>}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button 
          className="btn btn-link nav-link text-danger w-100 text-start d-flex align-items-center gap-2"
          onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
        >
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </aside>
  );
}
